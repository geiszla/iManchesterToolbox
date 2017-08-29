import NodeSsh from 'node-ssh';
import Promise from 'bluebird';

const ssh = new NodeSsh();
const fs = Promise.promisifyAll(require('fs'));

export default function getMarks(username, password) {
  const host = 'kilburn.cs.manchester.ac.uk';
  const scriptPath = `/home/${username}/.imant`;

  ssh
    .connect({
      host,
      port: 22,
      username,
      password
    })
    .then(() =>
      ssh.putFile('./server/arcade.py', `${scriptPath}/arcade.py`)
    )
    .then(() => {
      console.log('Script copied.');

      return new Promise((resolve, reject) => {
        const connection = ssh.connection;
        const startCommand = `python3 ${scriptPath}/arcade.py`;

        connection.on('ready', () => {
          console.log('ready');
        });

        connection.exec(startCommand, (err, stream) => {
          if (err) reject(err);

          stream.on('close', () => {
            console.log('Finished');
            resolve();
          }).on('data', (data) => {
            console.log(`Progress: ${data}`);
          }).stderr.on('data', (data) => {
            console.log(`Error: ${data}`);
          });
        });
      });
    })
    .then(() => {
      fs.statAsync('tmp/').catch(() => { fs.mkdir('tmp/'); });

      return ssh.getFile(`tmp/${username}result0.txt`, `${scriptPath}/finalresult0.txt`);
    })
    .then(() => {
      console.log('Result file copied.');

      ssh.dispose();
      return fs.readFileAsync(`tmp/${username}result0.txt`);
    })
    .then((data) => {
      const marks = parseMarks(data.toString(), username);

      fs.writeFileAsync('test.json', JSON.stringify(marks, null, 2)).then(() => {
        console.log('Parsing succesfully finished.');
      }).catch(err => console.log(err));
    })
    .catch((err) => {
      console.error(err);
    });
}

function parseMarks(inputString, username) {
  const marksData = {
    years: []
  };

  // Parse databases
  const databaseRegex = /Database ([0-9]{2})-([0-9]{2})-([0-9])(X?)/g;
  let databaseMatch;
  while ((databaseMatch = databaseRegex.exec(inputString))) {
    if (databaseMatch[4] === 'X') continue;

    const yearNumber = parseInt(databaseMatch[3], 10);
    const matchingYears = marksData.years.filter(year => year.number === yearNumber);

    let currYear;
    if (currYear.length > 0) {
      currYear = matchingYears[0];
    } else {
      currYear = {
        number: yearNumber,
        schoolYear: [parseInt(databaseMatch[1], 10), parseInt(databaseMatch[2], 10)]
      };
    }

    const subjects = [];

    // Parse tables
    const tableRegex = /Table (([0-9]{3})(s([0-9]))?([a-zA-Z]?)(fin)?|[^:]*)/g;
    tableRegex.lastIndex = databaseMatch.index;

    let tableMatch;
    while ((tableMatch = tableRegex.exec(inputString))) {
      const currClass = {
        _id: tableMatch[1],
        semester: tableMatch[4] ? parseInt(tableMatch[4], 10) : null,
        type: subjectTypes[tableMatch[5]] || null,
        isFinal: tableMatch[6] === 'fin',
        weight: null,
        total: null,
        isInProgress: null,
        marked: null
      };

      // Parse rows
      const weightings = parseRow('Weighting', inputString, tableMatch.index)
        .map(x => parseInt(x, 10));
      const denominators = parseRow('Denominator', inputString, tableMatch.index)
        .map(x => parseInt(x, 10));
      const names = parseRow('Email Name', inputString, tableMatch.index);
      const marks = parseRow(username, inputString, tableMatch.index);

      const sessions = [];
      for (let i = 0; i < names.length; i++) {
        // Parse marks
        const markRegex = /(?:\(?([0-9]+\.?[0-9]*)\+?\)?|-)([EL]{0,2})/;
        const markMatch = markRegex.exec(marks[i]);

        const markValue = !isNaN(markMatch[1]) ? parseFloat(markMatch[1]) : null;
        const isExpected = markMatch[2].includes('E');

        if (names[i] === 'Weight') {
          currClass.weight = markValue;
          continue;
        }

        if (names[i] === 'Total') {
          currClass.total = markValue;
          currClass.isInProgress = isExpected;
          continue;
        }

        if (names[i] === 'Marked') {
          currClass.marked = markValue;
          continue;
        }

        const currSession = {
          name: names[i],
          weighting: weightings[i],
          denominator: denominators[i],
          value: markValue,
          isEstimated: markMatch[0][0] === '(',
          isExpected,
          isLate: markMatch[2].includes('L')
        };

        sessions.push(currSession);
      }
      currClass.sessions = sessions;

      // Add current class to appropriate subject
      const currSubjects = currYear.subjects.filter(subject => subject._id === tableMatch[2]);
      if (currSubjects.length) {
        currSubjects[0].classes.push(currClass);
      } else {
        const currSubject = {
          _id: tableMatch[2] || null,
          name: subjectNames[tableMatch[2]] || null,
          classes: [currClass]
        };

        if (currSubject._id === null) currSubject._id = currClass._id;
        if (currSubject.name === null) currSubject.name = currClass._id;

        subjects.push(currSubject);
      }

      currYear.subjects = subjects.sort((a, b) => a._id < b._id);
    }

    marksData.years.push(currYear);
  }

  return marksData;
}

function parseRow(rowTitle, searchString, startIndex) {
  const regex = new RegExp(`${rowTitle}.*\\|[^\\n]*`, 'g');
  regex.lastIndex = startIndex;
  const match = regex.exec(searchString);

  return match[0].split('|').filter((value, index) => value && index !== 0).map(x => x.trim());
}

const subjectTypes = {
  L: 'Lab',
  E: 'Examples class',
  T: 'Test',
  C: 'Tutorial',
  X: 'Exam'
};

const subjectNames = {
  101: 'First Year Team Project',
  111: 'Mathematical Techniques for Computer Science',
  112: 'Fundamentals of Computation',
  121: 'Fundamentals of Computer Engineering',
  141: 'Fundamentals of Artificial Intelligence',
  151: 'Fundamentals of Computer Architecture',
  161: 'Object Oriented Programming with Java 1',
  162: 'Object Oriented Programming with Java 2',
  181: 'Fundamentals of Distributed Systems'
};
