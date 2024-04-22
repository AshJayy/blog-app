import { Link } from "react-router-dom"
import logo from '../assets/logo/logo-small.svg'

export default function Logo(props) {
    return(
        <Link to='/' className={"self-center whitespace-nowrap font-semibold dark:text-white " + props.textSize}>
            <span>
                <img src={logo} className={"self-center object-cover inline " + props.imgWidth}/>
            </span>
            <span className="px-1 sm:px-2 font-normal">Ash's</span>
            <span>Blog</span>
      </Link>
    )
}