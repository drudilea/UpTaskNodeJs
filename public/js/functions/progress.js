import Swal from 'sweetalert2';

export const updateProgress = (req, res) => {
  const tasks = document.querySelectorAll('li.tarea');

  if (tasks.length) {
    const completedTasks = document.querySelectorAll('i.completo');

    const progress = Math.round((completedTasks.length / tasks.length) * 100);

    const progressBar = document.querySelector('#porcentaje');
    progressBar.style.width = progress + '%';

    if (progress === 100) {
      Swal.fire('Congratulations!', 'You finished your tasks', 'success');
    }
  }
};
