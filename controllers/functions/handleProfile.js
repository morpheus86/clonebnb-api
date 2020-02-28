"use strict mode";
const handleProfile = async (db, req, res) => {
  try {
    const { id } = req.params;
    const profile = await db.findAll({
      where: {
        id
      }
    });
    res.json(profile[0]);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  handleProfile
};
