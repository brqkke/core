import {Link} from "react-router-dom";

export function Home() {
  return (
    
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <h1>Butanuki</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <Link className={"btn btn-primary btn-sm"} to={"/login"}>
            Login
          </Link>
        </div>
      </div>
    </div>
      
  );
}
