(function(){
const data="https://codeforces.com/api/contest.list";
let contest_list=[];
fetch(data)
  .then(list =>{ 
    // if(!list.ok)
    // {
    //     document.querySelector('body').innerHTML="Error in loading page:(";
    //     console.log("ERROR");
    // }
    //console.log(list);
    return list.json();
  })
  .then(l =>{
      //console.log(l);
      if(l.status=="OK")
      {
        contest_list.push(...(l.result));
        localStorage.setItem('contest_list',JSON.stringify(contest_list));
      }
      else
      {
        contest_list =  JSON.parse(localStorage.getItem('contest_list')) || [];
      }
      contest_list = contest_list.map(function(contest){
        function toHHMMSS(sec_num)
        {
            let date = new Date(0);//0=>set to epoch
            date.setUTCSeconds(sec_num);
            return date;
        }
        let date= toHHMMSS(contest.startTimeSeconds);
        let obj={
            id:contest.id,
            name:contest.name,
            startdate: date,
            link: `https://codeforces.com/contests/${contest.id}`,
            phase: contest.phase
        }
        return obj;
    }).sort((a,b)=>  (b.startdate-a.startdate));

    group_contest();
    display();
  });

let ele=document.querySelector('tbody');
let select_contest= document.querySelector('#type');
let types;
function group_contest()
{
   types= contest_list.reduce((types,contest)=>{
    let val;
    if(contest.name.indexOf("(Div. 1)")!=-1)
    {
      val="(Div. 1)";
    }
    else if(contest.name.indexOf("(Div. 2)")!=-1)
    {
      val="(Div. 2)";
    }
    else if(contest.name.indexOf("(Div. 3)")!=-1)
    {
      val="(Div. 3)";
    }
    else if(contest.name.indexOf("Educational")!=-1)
    {
      val="Educational";
    }
    else if(contest.name.indexOf("Global Round")!=-1)
    {
      val="Global Round";
    }
    else
    {
      val="others";
    }
    if(contest.phase=="BEFORE")
    {
      let temp="before";
      types[temp]=  [...types[temp] || [],contest];
    }
    types[val]= [...types[val] || [],contest];
    return types;
  },{});
 // console.log(types);
}


function display()
{
  let val=select_contest.value;
  let type=contest_list;
  if(val!="All")
  {
    type=types[val];
  }
  //console.log(val);
  ele.innerHTML="";
  type.forEach((contest)=>{

      let contest_html=document.createElement("tr");
      contest_html.innerHTML=`<td class="column1"><a href=${contest.link} target="_blank">${contest.name}</a></td>
      <td class="column2">${contest.startdate}</td>`;

      ele.appendChild(contest_html);
  });
}

select_contest.addEventListener('change',display);

})();
//.filter((contest)=> contest.phase=="BEFORE")