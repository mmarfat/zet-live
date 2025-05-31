import { Search, Bus, TramFront } from "lucide-react"

const TypeAvatar = ({ type, marker = false, label }) => {
  const getTypeConfig = (type) => {
    switch (type) {
      case "0":
        return {
          icon: TramFront,
          bgColor: `bg-blue-200 ${!marker ? "dark:bg-blue-900/30" : "dark:bg-blue-900/80"}`,
          iconColor: "text-black-600 dark:text-white-400",
        }
      case "3":
        return {
          icon: Bus,
          bgColor: `bg-green-200 ${!marker ? "dark:bg-green-900/30" : "dark:bg-green-900/80"}`,
          iconColor: "text-black-600 dark:text-white-400",
        }
      default:
        return {
          icon: Search,
          bgColor: `bg-gray-200 ${!marker ? "dark:bg-gray-900/30" : "dark:bg-gray-900/80"}`,
          iconColor: "text-black-600 dark:text-white-400",
        }
    }
  }

  const config = getTypeConfig(type)
  const IconComponent = config.icon

  return (
    <div className={`w-8 h-8 rounded-full ${config.bgColor} flex flex-col items-center justify-center`}>
      <IconComponent className={`h-4 w-4 ${config.iconColor}`} />
      {label && <span className="text-[0.5rem] font-bold text-black-600 dark:text-white-400">{label}</span>}
    </div>
  )
}

export default TypeAvatar;