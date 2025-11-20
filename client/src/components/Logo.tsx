import { Link } from "react-router-dom";
import logoWhite from "../assets/logo/logo-white.png";
import logoBlack from "../assets/logo/logo-black.png";
export default function LogoWhite() {
  return (
    <Link to="/" className="flex items-center">
      <img
        src={logoWhite}
        alt="Realtor App logo"
        className="h-16 w-auto"
      />
    </Link>
  )
}


export function LogoBlack() {
  return (
    <Link to="/" className="flex items-center">
      <img
        src={logoBlack}
        alt="Realtor App logo"
        className="h-16 w-auto"
      />
    </Link>
  )
}