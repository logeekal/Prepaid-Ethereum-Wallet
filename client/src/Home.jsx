import "./Home.css";
import React from "react";

/**
 *
 * https://codepen.io/kathykato/pen/rZRaNe
 */

export class Home extends React.Component {
  render() {
    return (
      <div className="form-container">
        <form className="main-from" action="/dash">
        <button class="btn" type="submit">
			<div class="square">
				<span class="icon arrow">
				</span>
			</div>
			<p class="btn-text">Get Started</p>
		</button>
        </form>
      </div>
    );
  }
}
