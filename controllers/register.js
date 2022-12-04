const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);

  //we wrap database coding in transaction,because if we are dealing with multiple tables then error during onee table

  //This transaction syntax is the most trickiest part of knex code
  //you create transaction when you had to do two or more than two things at once
  //and you use trx object intead of db

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    res.status(404).send("unable to register");
  });
};

module.exports = {
  handleRegister: handleRegister,
};
