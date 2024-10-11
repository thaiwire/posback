const { PrismaClient } = require("@prisma/client");
const { list } = require("./FoodTypeController");
const prisma = new PrismaClient();

module.exports = {
  upload: async (req, res) => {
    try {
      const myFile = req.myFile.myFile;
      if (myFile != undefined) {
        const filename = myFile.name;

        // rename file
        const fileExtension = filename.split(".").pop();
        const newFilename = new Date().getTime() + "." + fileExtension;
        const path = "uploads/" + newFilename;

        // save file
        myFile.mv(path, (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          return res.json({ message: "success", filename: newFilename });
        });
      } else {
        return res.status(400).json({ message: "No File Upload" });
      }
    } catch (e) {
      //return res.send({ message: "success", filename: newFilename });
      return res.send({ message: "success" });
    }
  },

  create: async (req, res) => {
    try {
      await prisma.food.create({
        data: {
          foodTypeId: req.body.foodTypeId,
          name: req.body.name,
          remark: req.body.remark,
          price: req.body.price,
          img: req.body.img,
        },
      });
      return res.send({ message: "Food created!" });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  list: async (req, res) => {
    try {
      const foods = await prisma.food.findMany();
      //   include: {
      //     foodType: true,
      //   },
      //   where: {
      //     status: "use",
      //   },
      //   orderBy: {
      //     id: "desc",
      //   },
      // });
      return res.send({ results: foods });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};
