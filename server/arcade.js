import Promise from 'bluebird';
// import ssh from 'ssh2';
const fs = Promise.promisifyAll(require('fs'));

export default function getMarks(username, password) {
  fs.readFileAsync('test.txt').then((data) => {
    const marks = parseMarks(data.toString(), 'mbaxaag2');

    fs.writeFileAsync('test.json', JSON.stringify(marks, null, 2)).then(() => {
      console.log('Parsing succesfully finished.');
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));

  // const Client = ssh.Client;

  // const conn = new Client();
  // conn.on('ready', function () {
  //   const startCommand = 'java -classpath /opt/teaching/lib/ARCADE TClient';

  //   let isConnected = false;
  //   let startListening = false;
  //   let responseString = '';
  //   conn.exec(startCommand, function (err, stream) {
  //     if (err) throw err;

  //     console.log('Connecting to Arcade...');

  //     stream.on('close', function (code, signal) {
  //       parseMarks(responseString);
  //       conn.end();
  //     }).on('data', function (data) {
  //       if (!isConnected && data.toString() === 'Initialisation completed') {
  //         console.log('Arcade: Succesfully connected.');
  //         isConnected = true;
  //       }

  //       if (isConnected && data.toString().includes('Running query')) {
  //         console.log('Arcade: Query sent.');
  //         startListening = true;
  //       }

  //       if (startListening) {
  //         responseString += data.toString();
  //       }
  //     }).stderr.on('data', function (data) {
  //       console.log('SSH Error: ' + data);
  //     });

  //     stream.end('c\n+\n2\nq\nq\nr\nx\n');
  //   });
  // }).connect({
  //   host: 'kilburn.cs.manchester.ac.uk',
  //   port: 22,
  //   username: username,
  //   password: password
  // });
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

    const currYear = {
      number: parseInt(databaseMatch[3], 10),
      schoolYear: [parseInt(databaseMatch[1], 10), parseInt(databaseMatch[2], 10)]
    };
    currYear.subjects = [];

    // Parse tables
    const tableRegex = /Table (([0-9]{3})(s([0-9]))?([a-zA-Z]?)(fin)?|[^:]*)/g;
    tableRegex.lastIndex = databaseMatch.index;

    let tableMatch;
    while ((tableMatch = tableRegex.exec(inputString))) {
      const currSubject = {
        _id: tableMatch[1],
        name: subjectNames[tableMatch[2]] || null,
        subjectId: tableMatch[2] || null,
        semester: tableMatch[4] ? parseInt(tableMatch[4], 10) : null,
        type: subjectTypes[tableMatch[5]] || null,
        isFinal: tableMatch[6] === 'fin'
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

        if (names[i] === 'Total') {
          currSubject.total = markValue;
          currSubject.isInProgress = isExpected;
          continue;
        }

        if (names[i] === 'Marked') {
          currSubject.marked = markValue;
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
      currSubject.sessions = sessions;

      currYear.subjects.push(currSubject);
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
  L: 'lab',
  E: 'examples',
  T: 'test',
  C: 'clinic',
  X: 'exam'
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
