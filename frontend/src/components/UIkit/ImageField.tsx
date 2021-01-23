import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Store } from "../../re-ducks/store/types";
import { getUserId, getTheme } from "../../re-ducks/users/selectors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import RemoveIcon from "@material-ui/icons/Remove";
import { baseURL } from "../../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textLight: {
      color: "rgba(0, 0, 0, 0.54)",
    },
    textDark: {
      color: "rgba(255, 255, 255, 0.7)",
    },
    text: {
      fontSize: 16,
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
  signUp?: boolean;
  userEdit?: boolean;
  imagePath?: [number, string][];
  setProfile?: React.Dispatch<React.SetStateAction<File | null>>;
  setAppearances?: React.Dispatch<React.SetStateAction<File[]>>;
  setBreakfasts?: React.Dispatch<React.SetStateAction<File[]>>;
  setLunchs?: React.Dispatch<React.SetStateAction<File[]>>;
  setDinners?: React.Dispatch<React.SetStateAction<File[]>>;
  setSnacks?: React.Dispatch<React.SetStateAction<File[]>>;
  setAppearancesId?: React.Dispatch<React.SetStateAction<number[]>>;
  setMealsId?: React.Dispatch<React.SetStateAction<number[]>>;
};

const ImageField: React.FC<Props> = (props) => {
  const classes = useStyles();
  const text = props.text;
  const sheets = props.sheets;
  const profile = props.profile;
  const uprofile = props.uprofile;
  const signUp = props.signUp;
  const userEdit = props.userEdit;
  const imagePath = props.imagePath;
  const setProfile = props.setProfile;
  const setAppearances = props.setAppearances;
  const setBreakfasts = props.setBreakfasts;
  const setLunchs = props.setLunchs;
  const setDinners = props.setDinners;
  const setSnacks = props.setSnacks;
  const setAppearancesId = props.setAppearancesId;
  const setMealsId = props.setMealsId;
  const selector = useSelector((state: Store) => state);
  const uid = getUserId(selector);
  const theme = getTheme(selector);
  const [images, setImages] = useState<[File | number, string][]>([]);

  const preview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files;
    if (imageFile) {
      setProfile && setProfile(imageFile[0]);
      setAppearances && setAppearances((prev) => [...prev, imageFile[0]]);
      setBreakfasts && setBreakfasts((prev) => [...prev, imageFile[0]]);
      setLunchs && setLunchs((prev) => [...prev, imageFile[0]]);
      setDinners && setDinners((prev) => [...prev, imageFile[0]]);
      setSnacks && setSnacks((prev) => [...prev, imageFile[0]]);
      const imageUrl = URL.createObjectURL(imageFile[0]);
      setImages([...images, [imageFile[0], imageUrl]]);
    }
  };

  const deletePreview = (image: [File | number, string]) => {
    if (typeof image[0] === "number") {
      const imageId = image[0] as number;
      setAppearancesId && setAppearancesId((prev) => [...prev, imageId]);
      setMealsId && setMealsId((prev) => [...prev, imageId]);
    }
    setProfile && setProfile(null);
    setAppearances &&
      setAppearances((prev) => prev.filter((ele) => ele !== image[0]));
    setBreakfasts &&
      setBreakfasts((prev) => prev.filter((ele) => ele !== image[0]));
    setLunchs && setLunchs((prev) => prev.filter((ele) => ele !== image[0]));
    setDinners && setDinners((prev) => prev.filter((ele) => ele !== image[0]));
    setSnacks && setSnacks((prev) => prev.filter((ele) => ele !== image[0]));
    const result = images.filter((ele) => ele !== image);
    setImages(result);
  };

  useEffect(() => {
    if (imagePath) {
      for (const ele of imagePath) {
        ele[1] = baseURL + ele[1];
      }
      setImages(imagePath);
    }
  }, [imagePath]);

  return (
    <div>
      {userEdit || signUp ? (
        <>
          {theme === "light" ? (
            <p className={classes.textLight}>{text}</p>
          ) : (
            <p className={classes.textDark}>{text}</p>
          )}
        </>
      ) : (
        <p className={classes.text}>{text}</p>
      )}
      <div className={classes.previews}>
        {images.length > 0 &&
          images.map((ele, index) => (
            <div
              key={index}
              className={classes.preview + " " + classes.imageSize}
            >
              <span
                id="delete-preview"
                className={classes.deletePreview + " " + classes.wrapIcon}
                onClick={() => deletePreview(ele)}
              >
                <RemoveIcon className={classes.removeIcon} />
              </span>
              {profile ? (
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
        {images.length > sheets || (
          <>
            {uprofile ? (
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
                      src={uprofile}
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
                      src={uprofile}
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
                {profile ? (
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
