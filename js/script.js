<script>

  // SHOW SECTIONS

  function showSection(sectionId) {

    const sections =
      document.querySelectorAll(".content-section");

    sections.forEach((section) => {

      section.classList.remove("active");

    });

    document
      .getElementById(sectionId)
      .classList.add("active");

  }

  // LOGOUT

  function logout() {

    window.location.href = "index.html";

  
  }

</script>