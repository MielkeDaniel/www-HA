const validateImage = (file) => {
  if (!file || file.size == 0)
    return "Something went wrong! Please try again...";
};

export default validateImage;
