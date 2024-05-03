import {useSelector} from 'react-redux'

export default function ThemeProvider({children}) {
    const {theme} = useSelector(state => state.theme);
  return (
    <div className={theme}>
        <div className="bg-white text-gray-700 dark:bg-bg-darkgray dark:text-gray-200">
            {children}
        </div>
    </div>
  )
}
