
const tabs = document.querySelectorAll('.form__tab');
const steps = document.querySelectorAll('.form__step');
const nextBtns = document.querySelectorAll('.form__next');
const prevBtns = document.querySelectorAll('.form__prev');

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('form__tab--active'));
    steps.forEach(s => s.classList.remove('form__step--active'));

    tab.classList.add('form__tab--active');
    steps[index].classList.add('form__step--active');
  });
});

nextBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const currentStep = btn.closest('.form__step');
    const nextStep = currentStep.nextElementSibling;
    const currentIndex = Array.from(steps).indexOf(currentStep);

    let valid = true;

    if(currentIndex === 0){ // Solo en GENERALES
      const requiredInputs = currentStep.querySelectorAll('input');

      requiredInputs.forEach(input => {
        if (!input.checkValidity()) {
          input.reportValidity();
          valid = false;
        }
      });
    }

    if(valid && nextStep){
      steps.forEach(s => s.classList.remove('form__step--active'));
      tabs.forEach(t => t.classList.remove('form__tab--active'));

      nextStep.classList.add('form__step--active');
      tabs[currentIndex + 1].classList.add('form__tab--active');
    }
  });
});

prevBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const currentStep = btn.closest('.form__step');
    const prevStep = currentStep.previousElementSibling;
    const currentIndex = Array.from(steps).indexOf(currentStep);

    if(prevStep){
      steps.forEach(s => s.classList.remove('form__step--active'));
      tabs.forEach(t => t.classList.remove('form__tab--active'));

      prevStep.classList.add('form__step--active');
      tabs[currentIndex - 1].classList.add('form__tab--active');
    }
  });
});
