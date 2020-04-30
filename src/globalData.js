const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const getGlobalData = async () => {
  const res = await fetch(`https://corona.lmao.ninja/v2/all`);
  const data = await res.json();
  document.getElementById("global-cases").innerHTML = formatNumber(data.cases);
  document.getElementById("global-cases-today").innerHTML = ` + ${formatNumber(
    data.todayCases
  )} Cases Today`;
  document.getElementById("global-deaths").innerHTML = formatNumber(
    data.deaths
  );
  document.getElementById("global-deaths-today").innerHTML = ` + ${formatNumber(
    data.todayDeaths
  )} Deaths Today`;

  document.getElementById("global-recoveries").innerHTML = formatNumber(
    data.recovered
  );
};
