const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);


/* =========================
   SAMPLE EXPOSURE RECORDS
========================= */

const records = [
  ["RJK-001", "Day", 45, "Valid"],
  ["AKM-014", "Night", 62, "Review"],
  ["SKP-021", "Day", 31, "Valid"],
  ["MNP-008", "Night", 18, "Valid"],
  ["VRS-033", "Day", 76, "Review"]
];


/* =========================
   TAB NAVIGATION
========================= */

function tab(id) {

  $$(".tab").forEach(x => {
    x.classList.remove("active");
  });

  $$(".top nav button").forEach(x => {
    x.classList.remove("active");
  });

  $("#" + id).classList.add("active");

  const button = $(`[data-tab="${id}"]`);

  if (button) {
    button.classList.add("active");
  }

  window.scrollTo(0, 0);
}


$$(".top nav button").forEach(button => {

  button.onclick = () => {
    tab(button.dataset.tab);
  };

});


$$("[data-go]").forEach(button => {

  button.onclick = () => {
    tab(button.dataset.go);
  };

});


/* =========================
   DEMO DOSE ESTIMATION
========================= */

function estimate() {

  let darkness =
    +$("#dark").value;

  let temperature =
    +$("#temp").value;

  let humidity =
    +$("#hum").value;


  /*
    DEMO ONLY.

    This is not a validated H₂S
    exposure model.

    Replace this function with
    the validated ML model.
  */

  let dose = Math.max(
    0,
    Math.round(
      darkness * 2.15 +
      (temperature - 27) * 0.8 +
      (humidity - 55) * 0.15
    )
  );


  let ci =
    Math.max(
      3,
      Math.round(dose * 0.15)
    );


  $("#dose").textContent =
    dose;

  $("#heroDose").textContent =
    dose;


  $("#ci").textContent =
    `${Math.max(0, dose - ci)}–${dose + ci}`;


  $("#valid").textContent =
    dose > 160
      ? "REVIEW"
      : "VALID";


  $("#quality").textContent =
    dose > 130
      ? "Review"
      : "Good";
}


/* =========================
   SLIDER CONTROLS
========================= */

[
  ["dark", "darkOut", "%"],
  ["temp", "tempOut", "°C"],
  ["hum", "humOut", "%"]

].forEach(([input, output, unit]) => {

  $("#" + input).oninput = e => {

    $("#" + output).textContent =
      e.target.value + unit;

    estimate();

  };

});


/* =========================
   IMAGE UPLOAD
========================= */

$("#image").onchange = e => {

  const file =
    e.target.files[0];

  if (!file) return;


  $("#preview").src =
    URL.createObjectURL(file);

  $("#preview").style.display =
    "block";

  $("#ph").style.display =
    "none";


  $("#c1").textContent =
    "✓ Framing";

  $("#c2").textContent =
    "✓ Reference detected";

  $("#c3").textContent =
    "✓ Ready for calibration";
};


/* =========================
   AI QUANTIFICATION DEMO
========================= */

$("#run").onclick = () => {

  $("#c1").textContent =
    "✓ Framing";

  $("#c2").textContent =
    "✓ Reference detected";

  $("#c3").textContent =
    "✓ Lighting calibrated";

  estimate();

};


/* =========================
   EXPOSURE HISTORY
========================= */

function rows() {

  $("#rows").innerHTML =
    records
      .map(record => {

        return `
          <tr>
            <td>${record[0]}</td>
            <td>${record[1]}</td>
            <td>${record[2]} ppm·hr</td>
            <td>
              <b>${record[3]}</b>
            </td>
          </tr>
        `;

      })
      .join("");

}


rows();


/* =========================
   SAVE EXPOSURE RECORD
========================= */

$("#save").onclick = () => {

  let dose =
    +$("#dose").textContent;


  records.unshift([
    "RJK-001",
    "Day",
    dose,
    dose > 130
      ? "Review"
      : "Valid"
  ]);


  rows();


  $("#scans").textContent =
    1247;


  alert(
    "Prototype record saved for this browser session."
  );

};


/* =========================
   CSV EXPORT
========================= */

$("#csv").onclick = () => {

  let csv =
    "Worker,Shift,Dose_ppm_hr,Status\n" +
    records
      .map(record => record.join(","))
      .join("\n");


  let link =
    document.createElement("a");


  link.href =
    URL.createObjectURL(
      new Blob(
        [csv],
        {
          type: "text/csv"
        }
      )
    );


  link.download =
    "h2sense_demo_exposure.csv";


  link.click();

};


/* =========================
   DASHBOARD CHART
========================= */

$("#bars").innerHTML = [

  28,
  42,
  34,
  58,
  46,
  72,
  55

]
.map(value => {

  return `
    <i
      style="height:${value * 2.4}px"
    ></i>
  `;

})
.join("");


/* =========================
   ARCHITECTURE PIPELINE
========================= */

const steps = [

  [
    "01",
    "CAPTURE",
    "Sensor image + QR"
  ],

  [
    "02",
    "PREPROCESS",
    "Crop + rotate + QC"
  ],

  [
    "03",
    "CALIBRATE",
    "Reference patches"
  ],

  [
    "04",
    "FEATURES",
    "L*, a*, b* + ΔE"
  ],

  [
    "05",
    "ML",
    "RF + XGBoost"
  ],

  [
    "06",
    "OUTPUT",
    "ppm·hr + validity"
  ]

];


$("#pipeline").innerHTML =

  steps
    .map((step, index) => {

      return `
        <div class="step">

          <b>${step[0]}</b>

          <strong>
            ${step[1]}
          </strong>

          <span>
            ${step[2]}
          </span>

        </div>

        ${
          index < 5
            ? '<div class="arrow">→</div>'
            : ''
        }
      `;

    })
    .join("");


/* =========================
   INITIAL CALCULATION
========================= */

estimate();