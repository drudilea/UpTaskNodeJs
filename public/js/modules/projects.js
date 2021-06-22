import Swal from 'sweetalert2';
import axios from 'axios';

const btnDelete = document.querySelector('#delete-project');

if (btnDelete) {
  btnDelete.addEventListener('click', (e) => {
    // Custom attribute from HTML5 (data-project-url=...)
    const projectUrl = e.target.dataset.projectUrl;
    Swal.fire({
      title: 'Delete this project?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `${location.origin}/projects/${projectUrl}`;

        axios
          .delete(url, { params: { projectUrl } })
          .then((res) => {
            Swal.fire('Deleted!', res.data, 'success');
            // Redirect to home
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              title: 'Error',
              text: "Project couldn't be deleted",
              icon: 'error',
            });
          });
      }
    });
  });
}

export default btnDelete;
