const path = require('path');
const sqlite3 = require(path.join(__dirname, '../server/node_modules/sqlite3')).verbose();

const dbPath = path.join(__dirname, '../server/smallville.db');
const schemaPath = path.join(__dirname, '../shared/schema.sql');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Read and execute schema
    const fs = require('fs');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing database:', err);
            process.exit(1);
        }

        console.log('Database initialized successfully!');
        console.log(`Database file: ${dbPath}`);

        db.close();
    });
});