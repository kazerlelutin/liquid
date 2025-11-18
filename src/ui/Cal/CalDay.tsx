import { Show, createSignal, onMount } from "solid-js"
import type { CalDayProps } from "./CalDay.types"

export const CalDay = (props: CalDayProps) => {
  const [isMobile, setIsMobile] = createSignal(false)

  onMount(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  })

  const handleDayClick = () => {
    props.onDayClick(props.day.date)
  }


  return (

    <Show
      when={isMobile()}
      fallback={
        /* Vue desktop */
        <div
          class="
            p-2 border border-primary rounded-sm cursor-pointer hover:bg-primary
            data-[current-month=false]:opacity-30
            data-[today=true]:text-accent data-[today=true]:border-accent data-[today=true]:bg-transparent 
            data-[selected=true]:bg-primary data-[selected=true]:border-primary
            data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed
            "
          data-current-month={props.day.isCurrentMonth}
          data-today={props.day.isToday}
          data-selected={props.day.isSelected}
          onClick={handleDayClick}
        >
          <div class="text-lg font-medium mb-1 flex items-center justify-center">
            {props.formatDate(props.day.date)}
          </div>
        </div>
      }
    >
      {/* Vue mobile avec ronds */}
      <div
        class="aspect-square rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary 
                 data-[current-month=false]:text-gray-400 data-[current-month=false]:bg-bg 
                 data-[today=true]:bg-secondary data-[today=true]:border-secondary 
                 data-[selected=true]:bg-primary data-[selected=true]:border-primary"
        data-current-month={props.day.isCurrentMonth}
        data-today={props.day.isToday}
        data-selected={props.day.isSelected}
        onClick={handleDayClick}
      >
        {/* Numéro du jour */}
        <div class="text-sm font-medium mb-1">
          {props.formatDate(props.day.date)}
        </div>
      </div>
    </Show>

  )
}