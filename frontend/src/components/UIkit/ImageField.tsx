import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import RemoveIcon from "@material-ui/icons/Remove";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    previews: {
      display: "flex",
      flexWrap: "wrap",
    },
    imageSize: {
      width: 100,
      height: 100,
      [theme.breakpoints.up("sm")]: {
        width: 150,
        height: 150,
      },
    },
    preview: {
      position: "relative",
      margin: 10,
    },
    deletePreview: {
      position: "absolute",
      top: -15,
      right: -15,
      backgroundColor: "#fff",
      border: "1px solid #bdbdbd",
      width: 30,
      height: 30,
      borderRadius: "50%",
    },
    image: {
      objectFit: "contain",
    },
    addImage: {
      display: "inline-block",
      backgroundColor: "#bdbdbd",
      margin: 10,
    },
    wrapIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "&:hover": {
        cursor: "pointer",
      },
    },
    icon: {
      width: 40,
      height: 40,
      [theme.breakpoints.up("sm")]: {
        width: 50,
        height: 50,
      },
      color: "#fff",
    },
    none: {
      display: "none",
    },
    profile: {
      borderRadius: "50%",
    },
  })
);

type Props = {
  text: string;
  sheets: number;
  profile: boolean;
  setProfile?: React.Dispatch<React.SetStateAction<File | null>>;
  setImages?: React.Dispatch<React.SetStateAction<File[]>>;
};

const ImageField: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [images, setImages] = useState<[File, string][]>([]);

  const preview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files;
    if (imageFile) {
      props.setProfile && props.setProfile(imageFile[0]);
      props.setImages && props.setImages((prev) => [...prev, imageFile[0]]);
      const imageUrl = URL.createObjectURL(imageFile[0]);
      setImages((prev) => [...prev, [imageFile[0], imageUrl]]);
    }
  };

  const deletePreview = async (image: [File, string]) => {
    props.setProfile && props.setProfile(null);
    props.setImages &&
      props.setImages((prev) => prev.filter((ele) => ele !== image[0]));
    const result = images.filter((ele) => ele !== image);
    setImages(result);
  };

  return (
    <div>
      <p>{props.text}</p>
      <div className={classes.previews}>
        {images.length > 0 &&
          images.map((ele, index) => (
            <div
              key={index}
              className={classes.preview + " " + classes.imageSize}
            >
              <span
                className={classes.deletePreview + " " + classes.wrapIcon}
                onClick={() => deletePreview(ele)}
              >
                <RemoveIcon />
              </span>
              {props.profile ? (
                <img
                  className={
                    classes.image +
                    " " +
                    classes.imageSize +
                    " " +
                    classes.profile
                  }
                  src={ele[1]}
                  alt="プレビュー"
                />
              ) : (
                <img
                  className={classes.image + " " + classes.imageSize}
                  src={ele[1]}
                  alt="プレビュー"
                />
              )}
            </div>
          ))}
        {images.length > props.sheets || (
          <>
            {props.profile ? (
              <div
                className={
                  classes.addImage +
                  " " +
                  classes.imageSize +
                  " " +
                  classes.profile
                }
              >
                <label>
                  <div className={classes.wrapIcon + " " + classes.imageSize}>
                    <AddAPhotoIcon className={classes.icon} />
                  </div>
                  <input
                    className={classes.none}
                    type="file"
                    accept="image/*"
                    onChange={preview}
                  />
                </label>
              </div>
            ) : (
              <div className={classes.addImage + " " + classes.imageSize}>
                <label>
                  <div className={classes.wrapIcon + " " + classes.imageSize}>
                    <AddAPhotoIcon className={classes.icon} />
                  </div>
                  <input
                    className={classes.none}
                    type="file"
                    accept="image/*"
                    onChange={preview}
                  />
                </label>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageField;
