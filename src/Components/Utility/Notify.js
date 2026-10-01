import toast, { Toaster } from "react-hot-toast";

const notify = (note, type) => {
  // console.log(type);
  switch (type) {
    case "success":
      toast.success(`${note}`);
      break;
    case "loading":
      toast.loading(`${note}`);
      break;
    case "error":
      toast.error(`${note}`);
      break;

    default:
      toast(note);
  }
};

export { notify };
