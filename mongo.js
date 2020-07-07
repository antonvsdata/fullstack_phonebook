const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://anton:${password}@cluster0-c84bs.azure.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("persons", personSchema);

// List persons in db
if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((note) => {
      console.log(note.name, note.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length < 5) {
  console.log("give both name and number as arguments");
  process.exit(1);
} else {
  // Add a new person
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((res) => {
    console.log("person saved");
    mongoose.connection.close();
  });
}
