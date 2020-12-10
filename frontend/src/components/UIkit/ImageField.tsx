import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Store } from "../../re-ducks/store/types";
import { getUserId, getTheme } from "../../re-ducks/users/selectors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import RemoveIcon from "@material-ui/icons/Remove";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textLight: {
      color: "rgba(0, 0, 0, 0.38)",
    },
    textDark: {
      color: "rgba(255, 255, 255, 0.5)",
    },
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
      objectFit: "cover",
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
    removeIcon: {
      color: "#000",
    },
  })
);

type Props = {
  text: string;
  sheets: number;
  profile: boolean;
  uprofile?: string;
  setProfile?: React.Dispatch<React.SetStateAction<File | null>>;
  setAppearances?: React.Dispatch<React.SetStateAction<File[]>>;
  setBreakfasts?: React.Dispatch<React.SetStateAction<File[]>>;
  setLunchs?: React.Dispatch<React.SetStateAction<File[]>>;
  setDinners?: React.Dispatch<React.SetStateAction<File[]>>;
  setSnacks?: React.Dispatch<React.SetStateAction<File[]>>;
};

const ImageField: React.FC<Props> = (props) => {
  const classes = useStyles();
  const selector = useSelector((state: Store) => state);
  const uid = getUserId(selector);
  const theme = getTheme(selector);
  const [images, setImages] = useState<[File, string][]>([]);

  const preview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files;
    if (imageFile) {
      props.setProfile && props.setProfile(imageFile[0]);
      props.setAppearances &&
        props.setAppearances((prev) => [...prev, imageFile[0]]);
      props.setBreakfasts &&
        props.setBreakfasts((prev) => [...prev, imageFile[0]]);
      props.setLunchs && props.setLunchs((prev) => [...prev, imageFile[0]]);
      props.setDinners && props.setDinners((prev) => [...prev, imageFile[0]]);
      props.setSnacks && props.setSnacks((prev) => [...prev, imageFile[0]]);
      const imageUrl = URL.createObjectURL(imageFile[0]);
      setImages([...images, [imageFile[0], imageUrl]]);
    }
  };

  const deletePreview = async (image: [File, string]) => {
    props.setProfile && props.setProfile(null);
    props.setAppearances &&
      props.setAppearances((prev) => prev.filter((ele) => ele !== image[0]));
    props.setBreakfasts &&
      props.setBreakfasts((prev) => prev.filter((ele) => ele !== image[0]));
    props.setLunchs &&
      props.setLunchs((prev) => prev.filter((ele) => ele !== image[0]));
    props.setDinners &&
      props.setDinners((prev) => prev.filter((ele) => ele !== image[0]));
    props.setSnacks &&
      props.setSnacks((prev) => prev.filter((ele) => ele !== image[0]));
    const result = images.filter((ele) => ele !== image);
    setImages(result);
  };

  return (
    <div>
      {uid === "1" ? (
        <>
          {theme === "light" ? (
            <p className={classes.textLight}>{props.text}</p>
          ) : (
            <p className={classes.textDark}>{props.text}</p>
          )}
        </>
      ) : (
        <p>{props.text}</p>
      )}
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
                <RemoveIcon className={classes.removeIcon} />
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
            {props.uprofile ? (
              <label>
                {uid === "1" ? (
                  <>
                    <img
                      className={
                        classes.image +
                        " " +
                        classes.imageSize +
                        " " +
                        classes.profile
                      }
                      src={props.uprofile}
                      alt="プレビュー"
                    />
                    <input
                      className={classes.none}
                      type="file"
                      accept="image/*"
                      onChange={preview}
                      disabled
                    />
                  </>
                ) : (
                  <>
                    <img
                      className={`${classes.image} ${classes.imageSize} ${classes.profile} pointer-h`}
                      src={props.uprofile}
                      alt="プレビュー"
                    />
                    <input
                      className={classes.none}
                      type="file"
                      accept="image/*"
                      onChange={preview}
                    />
                  </>
                )}
              </label>
            ) : (
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
                      <div
                        className={classes.wrapIcon + " " + classes.imageSize}
                      >
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
                      <div
                        className={classes.wrapIcon + " " + classes.imageSize}
                      >
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
          </>
        )}
      </div>
    </div>
  );
};

export default ImageField;
