import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";

// import { useStateContext } from "../contexts/ContextProvider"

import { useDispatch } from "react-redux";
import { notiActions } from "../store/notification";

export default function UserForm() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  // Via Context API
  //   const { setNotification } = useStateContext();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    //passwordconfirmation: "",
  });

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          //debugger;
          setUser(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();

    if (user.id) {
      axiosClient
        .put(`/users/${user.id}`, user)
        .then(() => {
          // Via Context API
          //setNotification('User was successfully updated');

          dispatch(
            notiActions.settingNotiMessage("User was successfully updated")
          );

          setTimeout(() => {
            dispatch(notiActions.settingNotiMessage(null));
          }, 3000);

          navigate("/users");
        })
        .catch((err) => {
          // const response = err.response;
          // if (response && (response.status == 422 || response.status == 400)) {
          //   console.log(response.data.errors);
          //   setErrors(response.data.errors);
          // }

          const response = err.response;

          if (response?.data?.errors) {
            setErrors(response.data.errors);
          } else if (response?.data?.message) {
            setErrors({ general: [response.data.message] });
          }
        });
    } else {
      axiosClient
        .post(`/users`, user)
        .then(() => {
          // Via Context API
          //   setNotification("User was successfully created");

          dispatch(
            notiActions.settingNotiMessage("User was successfully created")
          );

          setTimeout(() => {
            dispatch(notiActions.settingNotiMessage(null));
          }, 3000);

          navigate("/users");
        })
        .catch((err) => {
          // const response = err.response;
          // console.log("Response: ", response);
          // if (response && (response.status == 422 || response.status == 400)) {
          //   console.log(response.data.errors);
          //   setErrors(response.data.errors);
          // }

          // Whether it's a 400 due to business logic or a 500, the frontend can consistently use as follows
          // to set the errors:
          const response = err.response;

          console.log("Error Response:", response); // <== Add this line

          if (response?.data?.errors) {
            setErrors(response.data.errors);
          } else if (response?.data?.message) {
            setErrors({ general: [response.data.message] });
          }
        });
    }
  };

  const onCancel = () => {
    navigate("/users");
  };

  return (
    <>
      {user.id && <h1>Update User: {user.name}</h1>}
      {!user.id && <h1>New User</h1>}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}

        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        {!loading && (
          <>
            <form onSubmit={onSubmit}>
              <input
                value={user.name}
                onChange={(ev) => setUser({ ...user, name: ev.target.value })}
                placeholder="Name"
              />
              <input
                type="email"
                value={user.email}
                onChange={(ev) => setUser({ ...user, email: ev.target.value })}
                placeholder="Email"
              />
              <input
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password: ev.target.value })
                }
                placeholder="Password"
              />
              <input
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password_confirmation: ev.target.value })
                }
                placeholder="Password Confirmation"
              />
              <button className="btn" onClick={onCancel}>
                Cancel
              </button>{" "}
              <button className="btn">Save</button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
