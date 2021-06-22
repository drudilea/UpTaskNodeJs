import Swal from 'sweetalert2';
import axios from 'axios';
import { updateProgress } from '../functions/progress';

const tasks = document.querySelector('.listado-pendientes');

if (tasks) {
  tasks.addEventListener('click', (e) => {
    // Edit status button
    if (e.target.classList.contains('fa-check-circle')) {
      const icon = e.target;
      const taskId = icon.parentElement.parentElement.dataset.task;

      const url = `${location.origin}/tasks/${taskId}`;

      axios.patch(url, { taskId }).then((res) => {
        if (res.status === 200) {
          icon.classList.toggle('completo');
          updateProgress();
        }
      });
    }

    // Delte task button
    if (e.target.classList.contains('fa-trash')) {
      const taskHTML = e.target.parentElement.parentElement;
      const taskId = taskHTML.dataset.task;

      Swal.fire({
        title: 'Delete this task?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.value) {
          const url = `${location.origin}/tasks/${taskId}`;
          axios.delete(url, { params: { taskId } }).then((res) => {
            if (res.status === 200) {
              // Delete html node
              taskHTML.parentElement.removeChild(taskHTML);
              Swal.fire('Deleted!', res.data, 'success');
              updateProgress();
            }
          });
        }
      });
    }
  });
}

export default tasks;
