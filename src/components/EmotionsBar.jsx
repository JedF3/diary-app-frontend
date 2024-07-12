import axios from "axios";
import { Bar } from 'react-chartjs-2';
import EntryDashDisplayItem from "./EntryDashDisplayItem";
import { useContext, useEffect, useState } from "react";
import UserContext from "./context/UserContext";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import DashItem from "./DashItem";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
function EmotionsBar(){
  const {user} = useContext(UserContext);
  const [lastWeekEntry, setLastWeekEntry] = useState([]);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Summary of entries the past week',
        font:{
          size:30
        },
      },
    },
  };
  function dateScope(){
    let result=[];
    for(let i = 0; i<=6; i++){
      result[i]=new Date(new Date().setDate(new Date().getDate()-6+i));  
    }
    return result;
  }
  function getlabels(){
    let tempLabel=([])
    dateForLabels.forEach((date, i)=>{
      tempLabel.push((date.getMonth()+1)+"/"+date.getDate());
    });
    return tempLabel;
  }
  let [dateForLabels, setDateforLabels] = useState(dateScope());
  let [labels, setlabels]=useState(getlabels());
  async function getPastEmotionData(){
    const result = await axios.post("https://diary-app-backend-5dk0wdw5k-jedidiah-franciscos-projects.vercel.app/v1/entries/trackEmotions/", {}, { headers: { Authorization: `Bearer ${user.accessToken}` } })
    setLastWeekEntry(result.data.data);
  }
  const data = {
    labels,
    datasets: [
      {
        label: 'Anxious/Depressed',
        data: lastWeekEntry.length>0? labels.map((item, i)=>lastWeekEntry.filter((entry)=>entry.mainTag.emotionID==0 && new Date(entry.ForDate).toISOString().split("T")[0]==new Date(dateForLabels[i]).toISOString().split("T")[0]).length):[],
        backgroundColor: 'rgba(0, 153, 204, 0.5)',
      },
      {
        label: 'Angry',
        data: lastWeekEntry.length>0? labels.map((item, i)=>lastWeekEntry.filter((entry)=>entry.mainTag.emotionID==1 && new Date(entry.ForDate).toISOString().split("T")[0]==new Date(dateForLabels[i]).toISOString().split("T")[0]).length):[],
        backgroundColor: 'rgba(204, 0, 0, 0.5)',
      },
      {
        label: 'Sad',
        data: lastWeekEntry.length>0? labels.map((item, i)=>lastWeekEntry.filter((entry)=>entry.mainTag.emotionID==2 && new Date(entry.ForDate).toISOString().split("T")[0]==new Date(dateForLabels[i]).toISOString().split("T")[0]).length):[],
        backgroundColor: 'rgba(255, 204, 0, 0.5)',
      },
      {
        label: 'Neutral',
        data: lastWeekEntry.length>0? labels.map((item, i)=>lastWeekEntry.filter((entry)=>entry.mainTag.emotionID==3 && new Date(entry.ForDate).toISOString().split("T")[0]==new Date(dateForLabels[i]).toISOString().split("T")[0]).length):[],
        backgroundColor: 'rgba(255, 153, 102, 0.5)',
      },
      {
        label: 'Happy',
        data: lastWeekEntry.length>0? labels.map((item, i)=>lastWeekEntry.filter((entry)=>entry.mainTag.emotionID==4 && new Date(entry.ForDate).toISOString().split("T")[0]==new Date(dateForLabels[i]).toISOString().split("T")[0]).length):[],
        backgroundColor: 'rgba(204, 255, 102, 0.5)',
      },
      {
        label: 'Excited',
        data: lastWeekEntry.length>0? labels.map((item, i)=>lastWeekEntry.filter((entry)=>entry.mainTag.emotionID==5 && new Date(entry.ForDate).toISOString().split("T")[0]==new Date(dateForLabels[i]).toISOString().split("T")[0]).length):[],
        backgroundColor: 'rgba(51, 204, 51, 0.5)',
      },
      {
        label: 'Feeling Awesome',
        data: lastWeekEntry.length>0? labels.map((item, i)=>lastWeekEntry.filter((entry)=>entry.mainTag.emotionID==6 && new Date(entry.ForDate).toISOString().split("T")[0]==new Date(dateForLabels[i]).toISOString().split("T")[0]).length):[],
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
      },
    ],
  };
  useEffect(()=>{
    getPastEmotionData();
    setDateforLabels(dateScope());
  },[])
  useEffect(()=>{
    if(dateForLabels.length>0){
      let tempLabel=([])
      dateForLabels.forEach((date, i)=>{
        tempLabel.push((date.getMonth()+1)+"/"+date.getDate());
      });
      setlabels(tempLabel);
    }
  },[dateForLabels])
  useEffect(()=>{

  }, [labels])
  return(
    <div className="EmotionDisplayDiv center">
      {data.datasets&&
        <Bar options={options} data={data}/>
      }
    </div>
  );
}
export default EmotionsBar;
//result filter length