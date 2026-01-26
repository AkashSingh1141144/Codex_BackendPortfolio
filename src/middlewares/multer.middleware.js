// import multer from "multer";

// const storage = multer.diskStorage({});

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only images allowed"), false);
//     }
//   },
// });

// export default upload;






import multer from "multer";

const storage = multer.diskStorage({});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only images or PDF allowed"), false);
    }
  },
});

export default upload;

