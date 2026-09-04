"use client";

export default function CafeLoader() {
  return (
    <div className="pizza-loader">
      <div className="pizza-scene">

        {/* Flying particles */}
        <span className="spark spark-1">•</span>
        <span className="spark spark-2">•</span>
        <span className="spark spark-3">•</span>
        <span className="spark spark-4">•</span>


        <svg
          className="pizza-svg"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>

            {/* Crust */}
            <linearGradient id="crust" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffc45c" />
              <stop offset="55%" stopColor="#f49a25" />
              <stop offset="100%" stopColor="#d96a0c" />
            </linearGradient>

            {/* Cheese */}
            <radialGradient id="cheese">
              <stop offset="0%" stopColor="#ffe878" />
              <stop offset="65%" stopColor="#ffd02e" />
              <stop offset="100%" stopColor="#f2a900" />
            </radialGradient>

            {/* Sauce */}
            <radialGradient id="sauce">
              <stop offset="0%" stopColor="#e74b2d" />
              <stop offset="100%" stopColor="#b92816" />
            </radialGradient>

            {/* Shadow */}
            <filter id="shadow">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="3"
                floodOpacity=".2"
              />
            </filter>
          </defs>

          {/* =========================
              SLICE 1
          ========================== */}

          <g className="pizza-slice slice-1">

            {/* crust */}
            <path
              d="M100 100 L100 25 A75 75 0 0 1 153 47 Z"
              fill="url(#crust)"
              filter="url(#shadow)"
            />

            {/* cheese */}
            <path
              d="M100 100 L100 35 A65 65 0 0 1 146 53 Z"
              fill="url(#cheese)"
            />

            {/* sauce */}
            <path
              d="M100 100 L100 42 A58 58 0 0 1 140 58 Z"
              fill="url(#sauce)"
              opacity=".5"
            />

            {/* Pepperoni */}
            <circle cx="115" cy="62" r="7" fill="#d93620" />
            <circle cx="133" cy="69" r="6" fill="#d93620" />

            {/* Basil */}
            <ellipse
              cx="121"
              cy="83"
              rx="7"
              ry="3"
              fill="#4c9b35"
              transform="rotate(-25 121 83)"
            />

            {/* Cheese shine */}
            <ellipse
              cx="110"
              cy="48"
              rx="12"
              ry="3"
              fill="#fff3a6"
              opacity=".5"
              transform="rotate(25 110 48)"
            />
          </g>

          {/* =========================
              SLICE 2
          ========================== */}

          <g className="pizza-slice slice-2">

            <path
              d="M100 100 L153 47 A75 75 0 0 1 175 100 Z"
              fill="url(#crust)"
              filter="url(#shadow)"
            />

            <path
              d="M100 100 L153 53 A65 65 0 0 1 165 100 Z"
              fill="url(#cheese)"
            />

            <path
              d="M100 100 L153 59 A58 58 0 0 1 158 100 Z"
              fill="url(#sauce)"
              opacity=".5"
            />

            <circle cx="145" cy="75" r="7" fill="#d93620" />
            <circle cx="156" cy="91" r="6" fill="#d93620" />

            <ellipse
              cx="132"
              cy="91"
              rx="7"
              ry="3"
              fill="#4c9b35"
              transform="rotate(20 132 91)"
            />
          </g>

          {/* =========================
              SLICE 3
          ========================== */}

          <g className="pizza-slice slice-3">

            <path
              d="M100 100 L175 100 A75 75 0 0 1 153 153 Z"
              fill="url(#crust)"
              filter="url(#shadow)"
            />

            <path
              d="M100 100 L165 100 A65 65 0 0 1 153 147 Z"
              fill="url(#cheese)"
            />

            <path
              d="M100 100 L158 100 A58 58 0 0 1 148 140 Z"
              fill="url(#sauce)"
              opacity=".5"
            />

            <circle cx="143" cy="115" r="7" fill="#d93620" />
            <circle cx="132" cy="135" r="6" fill="#d93620" />

            <ellipse
              cx="158"
              cy="123"
              rx="7"
              ry="3"
              fill="#4c9b35"
            />
          </g>

          {/* =========================
              SLICE 4
          ========================== */}

          <g className="pizza-slice slice-4">

            <path
              d="M100 100 L153 153 A75 75 0 0 1 100 175 Z"
              fill="url(#crust)"
              filter="url(#shadow)"
            />

            <path
              d="M100 100 L147 147 A65 65 0 0 1 100 165 Z"
              fill="url(#cheese)"
            />

            <path
              d="M100 100 L140 140 A58 58 0 0 1 100 158 Z"
              fill="url(#sauce)"
              opacity=".5"
            />

            <circle cx="125" cy="143" r="7" fill="#d93620" />
            <circle cx="110" cy="155" r="6" fill="#d93620" />

            <ellipse
              cx="137"
              cy="132"
              rx="7"
              ry="3"
              fill="#4c9b35"
              transform="rotate(30 137 132)"
            />
          </g>

          {/* =========================
              SLICE 5
          ========================== */}

          <g className="pizza-slice slice-5">

            <path
              d="M100 100 L100 175 A75 75 0 0 1 47 153 Z"
              fill="url(#crust)"
              filter="url(#shadow)"
            />

            <path
              d="M100 100 L100 165 A65 65 0 0 1 53 147 Z"
              fill="url(#cheese)"
            />

            <path
              d="M100 100 L100 158 A58 58 0 0 1 60 140 Z"
              fill="url(#sauce)"
              opacity=".5"
            />

            <circle cx="84" cy="143" r="7" fill="#d93620" />
            <circle cx="68" cy="132" r="6" fill="#d93620" />

            <ellipse
              cx="79"
              cy="119"
              rx="7"
              ry="3"
              fill="#4c9b35"
              transform="rotate(-25 79 119)"
            />
          </g>

          {/* =========================
              SLICE 6
          ========================== */}

          <g className="pizza-slice slice-6">

            <path
              d="M100 100 L47 153 A75 75 0 0 1 25 100 Z"
              fill="url(#crust)"
              filter="url(#shadow)"
            />

            <path
              d="M100 100 L53 147 A65 65 0 0 1 35 100 Z"
              fill="url(#cheese)"
            />

            <path
              d="M100 100 L60 140 A58 58 0 0 1 42 100 Z"
              fill="url(#sauce)"
              opacity=".5"
            />

            <circle cx="58" cy="118" r="7" fill="#d93620" />
            <circle cx="47" cy="104" r="6" fill="#d93620" />

            <ellipse
              cx="74"
              cy="108"
              rx="7"
              ry="3"
              fill="#4c9b35"
            />
          </g>


{/* =========================
    SLICE 7
========================== */}

<g className="pizza-slice slice-7">

  {/* Crust */}
  <path
    d="M100 100 L25 100 A75 75 0 0 1 47 47 Z"
    fill="url(#crust)"
    filter="url(#shadow)"
  />

  {/* Cheese */}
  <path
    d="M100 100 L35 100 A65 65 0 0 1 53 53 Z"
    fill="url(#cheese)"
  />

  {/* Sauce */}
  <path
    d="M100 100 L42 100 A58 58 0 0 1 60 60 Z"
    fill="url(#sauce)"
    opacity=".5"
  />

  {/* Pepperoni */}
  <circle cx="57" cy="82" r="7" fill="#d93620" />
  <circle cx="70" cy="65" r="6" fill="#d93620" />

  {/* Basil */}
  <ellipse
    cx="78"
    cy="88"
    rx="7"
    ry="3"
    fill="#4c9b35"
    transform="rotate(-20 78 88)"
  />

</g>


{/* =========================
    SLICE 8
========================== */}

<g className="pizza-slice slice-8">

  {/* Crust */}
  <path
    d="M100 100 L47 47 A75 75 0 0 1 100 25 Z"
    fill="url(#crust)"
    filter="url(#shadow)"
  />

  {/* Cheese */}
  <path
    d="M100 100 L53 53 A65 65 0 0 1 100 35 Z"
    fill="url(#cheese)"
  />

  {/* Sauce */}
  <path
    d="M100 100 L60 60 A58 58 0 0 1 100 42 Z"
    fill="url(#sauce)"
    opacity=".5"
  />

  {/* Pepperoni */}
  <circle cx="82" cy="58" r="7" fill="#d93620" />
  <circle cx="95" cy="48" r="6" fill="#d93620" />

  {/* Basil */}
  <ellipse
    cx="82"
    cy="78"
    rx="7"
    ry="3"
    fill="#4c9b35"
    transform="rotate(25 82 78)"
  />

</g>
          {/* Center cheese */}
          <circle
            cx="100"
            cy="100"
            r="5"
            fill="#ffd52f"
            className="pizza-center"
          />
        </svg>
      </div>

      {/* Shadow */}
      <div className="pizza-ground-shadow" />

      {/* Loading text */}
      <div className="loading-text">
        <span>loading</span>

        <div className="loading-dots">
          <i />
          <i />
          <i />
        </div>
      </div>

      <style jsx>{`

      
        .pizza-loader {
          width: 130px;
          height: 135px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          position: relative;
        }

        .pizza-scene {
          width: 90px;
          height: 90px;

          position: relative;
        }

        .pizza-svg {
          width: 90px;
          height: 90px;

          overflow: visible;

          filter: drop-shadow(
            0 5px 5px rgba(100, 50, 10, .12)
          );
        }

        /* =====================================
           SLICE ANIMATION
        ===================================== */

        .pizza-slice {
          transform-box: fill-box;
          transform-origin: center;

          animation-duration: 3.6s;
          animation-timing-function: cubic-bezier(.55,.05,.35,1);
          animation-iteration-count: infinite;
        }

        /* Top-right */
        .slice-1 {
          animation-name: slice1;
        }

        @keyframes slice1 {

          0% {
            transform: translate(-45px, -35px)
              rotate(-35deg)
              scale(.55);

            opacity: 0;
          }

          18%,
          72% {
            transform: translate(0, 0)
              rotate(0)
              scale(1);

            opacity: 1;
          }

          88%,
          100% {
            transform: translate(-45px, -35px)
              rotate(-35deg)
              scale(.55);

            opacity: 0;
          }
        }

        /* Right */
        .slice-2 {
          animation-name: slice2;
        }

        @keyframes slice2 {

          0%,
          5% {
            transform: translate(50px, -5px)
              rotate(45deg)
              scale(.55);

            opacity: 0;
          }

          22%,
          72% {
            transform: translate(0, 0)
              rotate(0)
              scale(1);

            opacity: 1;
          }

          88%,
          100% {
            transform: translate(50px, -5px)
              rotate(45deg)
              scale(.55);

            opacity: 0;
          }
        }

        /* Bottom-right */
        .slice-3 {
          animation-name: slice3;
        }

        @keyframes slice3 {

          0%,
          10% {
            transform: translate(45px, 40px)
              rotate(55deg)
              scale(.55);

            opacity: 0;
          }

          26%,
          72% {
            transform: translate(0, 0)
              rotate(0)
              scale(1);

            opacity: 1;
          }

          88%,
          100% {
            transform: translate(45px, 40px)
              rotate(55deg)
              scale(.55);

            opacity: 0;
          }
        }

        /* Bottom */
        .slice-4 {
          animation-name: slice4;
        }

        @keyframes slice4 {

          0%,
          15% {
            transform: translate(5px, 52px)
              rotate(30deg)
              scale(.55);

            opacity: 0;
          }

          30%,
          72% {
            transform: translate(0, 0)
              rotate(0)
              scale(1);

            opacity: 1;
          }

          88%,
          100% {
            transform: translate(5px, 52px)
              rotate(30deg)
              scale(.55);

            opacity: 0;
          }
        }

        /* Bottom-left */
        .slice-5 {
          animation-name: slice5;
        }

        @keyframes slice5 {

          0%,
          20% {
            transform: translate(-45px, 40px)
              rotate(-45deg)
              scale(.55);

            opacity: 0;
          }

          34%,
          72% {
            transform: translate(0, 0)
              rotate(0)
              scale(1);

            opacity: 1;
          }

          88%,
          100% {
            transform: translate(-45px, 40px)
              rotate(-45deg)
              scale(.55);

            opacity: 0;
          }
        }

        /* Left */
        .slice-6 {
          animation-name: slice6;
        }

        @keyframes slice6 {

          0%,
          25% {
            transform: translate(-50px, -5px)
              rotate(-45deg)
              scale(.55);

            opacity: 0;
          }

          38%,
          72% {
            transform: translate(0, 0)
              rotate(0)
              scale(1);

            opacity: 1;
          }

          88%,
          100% {
            transform: translate(-50px, -5px)
              rotate(-45deg)
              scale(.55);

            opacity: 0;
          }
        }

        /* =====================================
           CENTER
        ===================================== */

        .pizza-center {
          animation: centerPulse 1.8s ease-in-out infinite;
        }

        @keyframes centerPulse {

          0%,
          100% {
            transform: scale(.8);
            opacity: .7;
          }

          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }

        /* =====================================
           GROUND SHADOW
        ===================================== */

        .pizza-ground-shadow {
          width: 58px;
          height: 6px;

          margin-top: -3px;

          border-radius: 50%;

          background: rgba(80, 40, 5, .18);

          filter: blur(2px);

          animation: groundShadow 3.6s ease-in-out infinite;
        }

        @keyframes groundShadow {

          0%,
          100% {
            transform: scale(.5);
            opacity: .1;
          }

          45%,
          70% {
            transform: scale(1);
            opacity: .45;
          }
        }

        /* =====================================
           FLOATING SPARKS
        ===================================== */

        .spark {
          position: absolute;

          color: #f59e0b;

          font-size: 9px;

          opacity: 0;

          z-index: 20;

          animation: sparkAnimation 2s ease-out infinite;
        }

        .spark-1 {
          left: 3px;
          top: 22px;
        }

        .spark-2 {
          right: 3px;
          top: 20px;

          animation-delay: .5s;
        }

        .spark-3 {
          left: 8px;
          bottom: 20px;

          animation-delay: 1s;
        }

        .spark-4 {
          right: 8px;
          bottom: 15px;

          animation-delay: 1.5s;
        }

        @keyframes sparkAnimation {

          0% {
            opacity: 0;
            transform: scale(.3) translateY(8px);
          }

          40% {
            opacity: .8;
          }

          100% {
            opacity: 0;
            transform: scale(1) translateY(-15px);
          }
        }

        /* =====================================
           TEXT
        ===================================== */

        .loading-text {
          display: flex;
          align-items: center;

          margin-top: 7px;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 2px;

          color: #78350f;
        }

        .loading-dots {
          display: flex;
          gap: 2px;
          margin-left: 3px;
        }

        .loading-dots i {
          width: 3px;
          height: 3px;

          border-radius: 50%;

          background: #ea580c;

          animation: dot 1s ease-in-out infinite;
        }

        .loading-dots i:nth-child(2) {
          animation-delay: .15s;
        }

        .loading-dots i:nth-child(3) {
          animation-delay: .3s;
        }

        @keyframes dot {

          0%,
          100% {
            transform: translateY(0);
            opacity: .25;
          }

          50% {
            transform: translateY(-3px);
            opacity: 1;
          }
        }


        /* =====================================
   SLICE 7 - TOP LEFT
===================================== */

.slice-7 {
  animation-name: slice7;
}

@keyframes slice7 {

  0%,
  30% {
    transform:
      translate(-45px, -35px)
      rotate(-45deg)
      scale(.55);
    opacity: 0;
  }

  48%,
  72% {
    transform:
      translate(0, 0)
      rotate(0)
      scale(1);
    opacity: 1;
  }

  88%,
  100% {
    transform:
      translate(-45px, -35px)
      rotate(-45deg)
      scale(.55);
    opacity: 0;
  }
}


.slice-8 {
  animation-name: slice8;
}

@keyframes slice8 {

  0%,
  35% {
    transform:
      translate(-5px, -52px)
      rotate(-30deg)
      scale(.55);
    opacity: 0;
  }

  52%,
  72% {
    transform:
      translate(0, 0)
      rotate(0)
      scale(1);
    opacity: 1;
  }

  88%,
  100% {
    transform:
      translate(-5px, -52px)
      rotate(-30deg)
      scale(.55);
    opacity: 0;
  }
}
      `}</style>
    </div>
  );
}