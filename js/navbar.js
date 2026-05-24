/* LOAD USER */

window.onload = async function () {
  const user = JSON.parse(localStorage.getItem("fuelshareUser"));

  if (user) {
    document.getElementById("beforeLogin").style.display = "none";

    document.getElementById("afterLogin").style.display = "flex";

    try {
      const response = await fetch(
        `https://fuelshare-exk6.onrender.com/get-profile/${user.email}`,
      );

      const data = await response.json();

      if (data.success) {
        const profile = data.profile;

        document.getElementById("navbarName").innerText = profile.fullname;

        document.getElementById("profileName").innerText = profile.fullname;

        document.getElementById("profileEmail").innerText = profile.email;

        document.getElementById("editName").value = profile.fullname;

        document.getElementById("editEmail").value = profile.email;

        document.getElementById("editPhone").value = profile.phone;

        document.getElementById("editAge").value = profile.age;
      } else {
        document.getElementById("navbarName").innerText = user.name;
      }
    } catch (error) {
      console.log(error);
    }
  }
};

/* TOGGLE PROFILE */

function toggleProfile() {
  document.getElementById("profileDropdown").classList.toggle("active");
}

/* CLOSE PROFILE */

function closeProfile() {
  document.getElementById("profileDropdown").classList.remove("active");
}

/* SAVE PROFILE */

async function saveProfile() {
  const updatedUser = {
    fullname: document.getElementById("editName").value,

    email: document.getElementById("editEmail").value,

    phone: document.getElementById("editPhone").value,

    age: document.getElementById("editAge").value,
  };

  try {
    const response = await fetch(
      "https://fuelshare-exk6.onrender.com4/save-profile",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(updatedUser),
      },
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem(
        "fuelshareUser",

        JSON.stringify({
          ...updatedUser,
        }),
      );

      document.getElementById("navbarName").innerText = updatedUser.fullname;

      document.getElementById("profileName").innerText = updatedUser.fullname;

      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  }
}

/* LOGOUT */

function logoutUser() {
  localStorage.removeItem("fuelshareUser");

  window.location.href = "login.html";
}
