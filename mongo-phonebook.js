const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phone = process.argv[4];
//@cluster0.qeb97rt.mongodb.net/?retryWrites=true&w=majority
const url = `mongodb+srv://anupammithu:${password}@cluster0.qeb97rt.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phoneBookSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const PhoneBook = mongoose.model("PhoneBook", phoneBookSchema);

const phone_book = new PhoneBook({
  name: name,
  phone: phone,
});

phone_book.save().then((result) => {
  console.log(result);
  console.log("note saved!");
  mongoose.connection.close();
});



mongoose.connect(url);
PhoneBook.find({}).then((result) => {
  console.log("phonebook:");
  result.map((p) => {
    console.log(p.name + "  " + p.phone);
  });
  mongoose.connection.close();
});
