import { CalCtrl } from "./Cal.ctrl"
import { Chevron } from "../Chevron/Chevron"

export const CalControls = () => {
  const calendar = CalCtrl()

  return (
    <div class="flex items-center gap-2">
      <button
        onClick={calendar.goToPrevious}
        class="headless"
        title="Mois précédent"
      >
        <Chevron direction="left" size={40} />
      </button>

      <div>
        {calendar.currentMonthName()} {calendar.currentYear()}
      </div>
      <button
        onClick={calendar.goToNext}
        class="headless"
        title="Mois suivant"
      >
        <Chevron direction="right" size={40} />
      </button>
    </div>
  )
}