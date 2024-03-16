import React, { useState, useMemo,useContext } from "react";
import { Carousel } from "@material-tailwind/react";
import { useParams, useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { updateCarDetails } from "../api/CarApi";
import { CarMakesAndModels } from "../res/CarMakesAndModels";
import Select from "react-select";
import { FaTimes } from "react-icons/fa";
import { deleteOldImages, updateCarImages, getCarImages } from "../api/CarApi";
import { xorDecrypt } from "../HelperFunctions/Encrypt";
import { getCar } from "../api/CarApi";
import { notify } from "../HelperFunctions/Notify";
import { AllCarsContext } from '../contexts/AllCarsContext';

export default function CarOwnerView() {
  const [editMode, setEditMode] = useState(false);
  const [updatedManufacturerCode, setUpdatedManufacturerCode] = useState("");
  const [updatedModelCode, setUpdatedModelCode] = useState("");
  const [updatedYear, setUpdatedYear] = useState("");
  const [updatedColor, setUpdatedColor] = useState("");
  const [updatedSeatsAmount, setUpdatedSeatsAmount] = useState("");
  const [updatedEngineType, setUpdatedEngineType] = useState("");
  const [updatedTransmissionType, setUpdatedTransmissionType] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedRentalPrice, setUpdatedRentalPrice] = useState("");
  const [uploadedImages, setUploadedImages] = useState(null);
  const [car, setCar] = useState([]);
  const {allCars,setAllCars} = useContext(AllCarsContext);
  



  let flag = false;

  const navigate = useNavigate();

  const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;
  //getting encrypted the plates number out of the paramaters that are passed in the car component.
  let { encryptedPlatesNumber } = useParams();
  
  // decryping the encrypted plates number from the parameters.
  let platesNumber = xorDecrypt(encryptedPlatesNumber, secretKey);
  // api call to fetch all car info based on plates number
  useMemo(() => {
    getCar(platesNumber)
      .then((res) => {
        setCar(res.data[0]);
      })
      .catch((error) => {
        notify("error", error);
      });
  }, []);

  const carImageUrls = useMemo(() => {
    if (car && car.car_urls) {
      return car.car_urls.split(",");
    }
    return [];
  }, [car]);

  useMemo(() => {
    if (car) {
      setUpdatedManufacturerCode(car.Manufacturer_Code || "");
      setUpdatedModelCode(car.model_code || "");
      setUpdatedYear(car.Year || "");
      setUpdatedColor(car.Color || "");
      setUpdatedSeatsAmount(car.Seats_Amount || "");
      setUpdatedEngineType(car.Engine_Type || "");
      setUpdatedTransmissionType(car.Transmission_type || "");
      setUpdatedDescription(car.Description || "");
      setUpdatedRentalPrice(car.Rental_Price_Per_Day || "");
    }
  }, [car]);

  const updateCarDetailsInDB = (images) => {
    const updatedCarDetails = {
      Manufacturer_Code: updatedManufacturerCode.toLowerCase(),
      model_name: updatedModelCode,
      model_code: updatedModelCode.toLowerCase(),
      Manufacturer_Name: updatedManufacturerCode.toUpperCase(),
      Year: updatedYear,
      Color: updatedColor,
      Seats_Amount: updatedSeatsAmount,
      Engine_Type: updatedEngineType,
      Transmission_type: updatedTransmissionType,
      Description: updatedDescription,
      Rental_Price_Per_Day: updatedRentalPrice,
      Plates_Number: car.Plates_Number,
    };
    // checking if we made any changes to any car field.
    const equal =
      updatedCarDetails.Manufacturer_Code === car.Manufacturer_Code &&
      updatedCarDetails.model_code === car.model_code &&
      updatedCarDetails.Year === car.Year &&
      updatedCarDetails.Color === car.Color &&
      updatedCarDetails.Seats_Amount === car.Seats_Amount &&
      updatedCarDetails.Engine_Type === car.Engine_Type &&
      updatedCarDetails.Transmission_type === car.Transmission_type &&
      updatedCarDetails.Description === car.Description &&
      updatedCarDetails.Rental_Price_Per_Day === car.Rental_Price_Per_Day &&
      updatedCarDetails.Plates_Number === car.Plates_Number;
    // if the user didnt make any changes exit edit mode and make no changes.
    if (equal) {
      if (images !== null) {
        const carDetails = {
          images: images,
          PlatesNumber: car.Plates_Number,
        };
        updateCarImages(carDetails)
          .then((res) => {
            console.log("Images updated successfully");
          })
          .catch((error) => {
            console.log(
              `Failed to update car images we got the following error ${error}.`
            );
          });
      } else {
        setEditMode(false);
        return;
      }
    } else {
      // update car images.
      if (images !== null) {
        const carDetails = {
          images: images,
          PlatesNumber: car.Plates_Number,
        };
        updateCarImages(carDetails)
          .then((res) => {
            console.log("Res in car update image = ", res);
            console.log("Images updated successfully");
          })
          .catch((error) => {
            console.log(
              `Failed to update car images we got the following error ${error}.`
            );
          });
      }
      updateCarDetails(updatedCarDetails)
        .then(() => {
          setEditMode(false);
          // update the car state with the new details.
          navigate("/UserProfile");
        })
        .catch((error) => {
          console.error("Failed to update car details:", error);
        });
    }
  };

  const getModelOptions = () => {
    const selectedBrand = CarMakesAndModels.find(
      ({ brand }) => brand === updatedManufacturerCode
    );
    return (
      selectedBrand?.models.map((model) => ({
        value: model,
        label: model,
      })) || []
    );
  };
  const handleCancelClick = () => {
    // Revert changes by setting the state back to the original car data
    setUpdatedManufacturerCode(car.Manufacturer_Code);
    setUpdatedModelCode(car.model_code);
    setUpdatedYear(car.Year);
    setUpdatedColor(car.Color);
    setUpdatedSeatsAmount(car.Seats_Amount);
    setUpdatedEngineType(car.Engine_Type);
    setUpdatedTransmissionType(car.Transmission_type);
    setUpdatedDescription(car.Description);
    setUpdatedRentalPrice(car.Rental_Price_Per_Day);

    setEditMode(false);
  };

  const handleSaveClick = () => {
    let filenames = null;
    if (uploadedImages !== null) {
      // Delete old images first
      const platesNumber = car.Plates_Number;
      getCarImages(platesNumber)
        .then((res) => {
          // if we found previous car images delete them then insert the new ones.
          if (res.data.length > 0) {
            deleteOldImages({ platesNumber: car.Plates_Number })
              .then((res) => {
                // Upload new images after old images are deleted
                handleUploadImages(uploadedImages)
                  .then((response) => {
                    const { files } = response.data;
                    const filenames = files.map((url) => {
                      const pathname = new URL(url).pathname;
                      return pathname.substring(pathname.lastIndexOf("/") + 1);
                    });
                    updateCarDetailsInDB(filenames);
                    // Update the state to reflect the changes
                    setCar((prevCar) => ({
                      ...prevCar,
                      car_urls: filenames.join(","),
                    }));
                  })
                  .catch((error) => {
                    console.error("Failed to upload new images:", error);
                  });
              })
              .catch((error) => {
                console.error("Failed to delete old images:", error);
              });
          }
          // if no pictures found upload the images to db and local folder.
          else {
            console.log("No images found");
            handleUploadImages(uploadedImages)
              .then((response) => {
                const { files } = response.data;
                console.log("files = ", files);
                filenames = files.map((url) => {
                  const pathname = new URL(url).pathname;
                  return pathname.substring(pathname.lastIndexOf("/") + 1);
                });
                console.log(filenames);
                updateCarDetailsInDB(filenames);
                // Update the state to reflect the changes
                setCar((prevCar) => ({
                  ...prevCar,
                  car_urls: filenames.join(","),
                }));
              })
              .catch((error) => {
                console.error("Failed to upload new images:", error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // If no new images are selected, update only other details
      updateCarDetailsInDB(filenames);
      // Update the state to reflect the changes
      setCar((prevCar) => ({
        ...prevCar,
        Manufacturer_Code: updatedManufacturerCode.toLowerCase(),
        model_code: updatedModelCode,
        Year: updatedYear,
        Color: updatedColor,
        Seats_Amount: updatedSeatsAmount,
        Engine_Type: updatedEngineType,
        Transmission_type: updatedTransmissionType,
        Description: updatedDescription,
        Rental_Price_Per_Day: updatedRentalPrice,
      }));
    }
    //window.location.reload(); // reload the page.
  };

  const handleImageUpload = (event) => {
    const fileList = event.target.files;
    const files = Array.from(fileList);
    setUploadedImages(files); // Store the selected files temporarily
  };

  const handleUploadImages = (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("carpics", files[i]);
    }

    return axios.post("http://localhost:3001/cars/uploadImages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <div className="w-full flex flex-1 border-2 border-red-500">
      <button
        className="absolute  hover:bg-[#CC6200] text-white font-bold top-20 right-0 w-20 m-4 p-3 rounded bg-black"
        onClick={() => navigate("/UserProfile")}
      >
        <FaTimes className="mx-auto" />
      </button>
      <div className="w-full flex-col flex items-center m-2 border-2 border-blue-500 justify-centerm-2">
        <Carousel className="rounded-md">
          {carImageUrls.length > 0 ? (
            carImageUrls.map((imageUrl, index) => (
              <figure key={index} className="rounded-xl">
                <img
                  src={`http://localhost:3001/images/${imageUrl}`}
                  alt={`Car Pic ${index + 1}`}
                  className="object-cover w-full h-80"
                />
              </figure>
            ))
          ) : (
            <figure>
              <img src="/images/noImages.png" alt="No Images" />
            </figure>
          )}
        </Carousel>
        {editMode && (
          <div className="w-1/4 m-6">
            <label
              htmlFor="file-input"
              className="bg-black hover:bg-[#CC6200] text-white font-semibold py-2 px-4 rounded-lg cursor-pointer flex justify-center items-center"
            >
              <FontAwesomeIcon icon={faCloudUploadAlt} className="mr-2" />
              Upload Picture
            </label>
            <input
              type="file"
              id="file-input"
              name="picture"
              onChange={handleImageUpload}
              className="hidden"
              multiple 
            />
          </div>
        )}
      </div>

      <div className="w-full p-4 m-2 border-2 border-black">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="md:w-1/2  p-2">
            <h2 className="text-2xl font-bold mb-2">
              {editMode ? (
                <>
                  <div className="mb-2">
                    <label
                      className="text-lg font-semibold"
                      htmlFor="manufacturer"
                    >
                      Manufacturer :
                    </label>
                    <Select
                      value={{
                        value: updatedManufacturerCode,
                        label: updatedManufacturerCode,
                      }}
                      onChange={(selectedOption) =>
                        setUpdatedManufacturerCode(selectedOption.value)
                      }
                      options={CarMakesAndModels.map(({ brand }) => ({
                        value: brand,
                        label: brand,
                      }))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <label className="text-lg font-semibold" htmlFor="model">
                    Model :
                  </label>
                  <div className="mb-2">
                    <Select
                      value={{
                        value: updatedModelCode,
                        label: updatedModelCode,
                      }}
                      onChange={(selectedOption) =>
                        setUpdatedModelCode(selectedOption.value)
                      }
                      options={getModelOptions()}
                      isDisabled={!updatedManufacturerCode}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <p className="m-2">
                    {`Manufacturer : ${car.Manufacturer_Code}`}{" "}
                  </p>
                  <p className="m-2">{`Model :  ${car.model_code}`} </p>
                </div>
              )}
            </h2>
            <p className="text-lg">
              {editMode ? (
                <>
                  <label className="text-lg font-semibold" htmlFor="year">
                    Year :
                  </label>
                  <Select
                    value={{
                      value: updatedYear,
                      label: updatedYear.toString(),
                    }}
                    onChange={(selectedOption) =>
                      setUpdatedYear(selectedOption.value)
                    }
                    options={Array.from(
                      { length: 2025 - 1990 },
                      (_, index) => ({
                        value: 1990 + index,
                        label: (1990 + index).toString(),
                      })
                    )}
                    className="w-full p-2 border rounded-md"
                  />
                </>
              ) : (
                <div>
                  <p className="m-2 text-2xl font-bold">{`Year: ${car.Year}`}</p>
                </div>
              )}
            </p>
            <div className="flex flex-col  items-start justify-between">
              <h3 className=" text-lg font-semibold mb-2">
                Rental Price (Per Day) :
              </h3>
              <div className="flex items-center w-full justify-center ">
                {editMode ? (
                  <input
                    type="number"
                    value={updatedRentalPrice}
                    onChange={(e) => setUpdatedRentalPrice(e.target.value)}
                    className="w-full p-2 border rounded-md m-2"
                  />
                ) : (
                  <div>
                    <p className="text-2xl font-bold m-2">
                      {car.Rental_Price_Per_Day} USD
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-2">
            <ul className="flex flex-col flex-wrap mt-4 mb-2">
              <li className="flex flex-col w-full items-start ">
                {editMode ? (
                  <>
                    <label
                      className="text-lg font-semibold"
                      htmlFor="seatsAmount"
                    >
                      Seats Amount:
                    </label>
                    <Select
                      value={{
                        value: updatedSeatsAmount,
                        label: updatedSeatsAmount.toString(),
                      }}
                      onChange={(selectedOption) =>
                        setUpdatedSeatsAmount(selectedOption.value)
                      }
                      options={Array.from(
                        { length: 15 - 2 + 1 },
                        (_, index) => ({
                          value: 2 + index,
                          label: (2 + index).toString(),
                        })
                      )}
                      className="w-full p-2 border rounded-md"
                    />
                  </>
                ) : (
                  <div>
                    <p className="font-bold text-2xl">{`Seats Amount: ${car.Seats_Amount}`}</p>
                  </div>
                )}
              </li>
              <li className="flex flex-col w-full items-start">
                {editMode ? (
                  <>
                    <label
                      className="text-lg font-semibold"
                      htmlFor="transmissionType"
                    >
                      Transmission Type:
                    </label>
                    <Select
                      value={{
                        value: updatedTransmissionType,
                        label: updatedTransmissionType,
                      }}
                      onChange={(selectedOption) =>
                        setUpdatedTransmissionType(selectedOption.value)
                      }
                      options={["Manual", "Auto"].map((transmissionOption) => ({
                        value: transmissionOption,
                        label: transmissionOption,
                      }))}
                      className="w-full p-2 border rounded-md "
                    />
                  </>
                ) : (
                  `Transmission Type: ${car.Transmission_type}`
                )}
              </li>
              <li className="flex flex-col w-full items-start">
                {editMode ? (
                  <>
                    <label
                      className="text-lg font-semibold"
                      htmlFor="engineType"
                    >
                      Engine Type:
                    </label>
                    <Select
                      value={{
                        value: updatedEngineType,
                        label: updatedEngineType,
                      }}
                      onChange={(selectedOption) =>
                        setUpdatedEngineType(selectedOption.value)
                      }
                      options={["Petrol", "Diesel", "Electric", "Hybrid"].map(
                        (engineOption) => ({
                          value: engineOption,
                          label: engineOption,
                        })
                      )}
                      className="w-full p-2 border rounded-md"
                    />
                  </>
                ) : (
                  `Engine Type: ${car.Engine_Type}`
                )}
              </li>
              <li className="flex flex-col items-start">
                <h3 className="text-lg font-semibold mb-2">Color:</h3>
                {editMode ? (
                  <Select
                    value={{ value: updatedColor, label: updatedColor }}
                    onChange={(selectedOption) =>
                      setUpdatedColor(selectedOption.value)
                    }
                    options={[
                      "red",
                      "black",
                      "blue",
                      "green",
                      "yellow",
                      "orange",
                      "purple",
                      "pink",
                      "gray",
                      "brown",
                      "white",
                    ].map((colorOption) => ({
                      value: colorOption,
                      label: colorOption,
                    }))}
                    className=" p-2 border w-full rounded-md"
                  />
                ) : (
                  `${car.Color}`
                )}
              </li>
            </ul>
            <ul className="flex flex-col w-full">
              <li>
                <h3 className="text-lg font-semibold mb-2">Description:</h3>
                {editMode ? (
                  <textarea
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                    className="w-full  border p-2 border-black rounded-md"
                  />
                ) : (
                  <p className="text-sm">{car.Description}</p>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className=" flex items-center justify-center m-6 max-w-full">
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 bg-blue-500 m-2 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </button>
          )}
          {editMode && (
            <button
              className="bg-green-500 m-2 text-black font-bold py-2 px-4 rounded"
              onClick={handleSaveClick}
            >
              Save
            </button>
          )}
          {editMode && (
            <button
              className="bg-red-500 m-2 text-black font-bold py-2 px-4 rounded ml-4"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
