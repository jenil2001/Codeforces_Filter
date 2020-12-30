const data="https://codeforces.com/api/problemset.problems";
let problem_list=[];
fetch(data)
    .then(list=>{
        return list.json();
    })
    .then(l=>{
        //console.log(l);
        problem_list.push(...(l.result.problems));
        //console.log(problem_list);
        problem_list= problem_list.map((problem)=>{
            let obj={
                name: problem.name,
                rating: problem.rating,
                tags: problem.tags,
                link: `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`
            }
            return obj;
        })
        display();
    });
let ele=document.querySelector('tbody');
let select_rating= document.querySelector('#type');
let user_filter= document.querySelector('.problem');
let user1_html= document.querySelector('#user1');
let user2_html= document.querySelector('#user2');
let ratings = document.querySelector('.column2');
function display()
{
    let type=problem_list;
    let val=select_rating.value;
    if(val!="All")
    {
        val=Number(val);
        if(val==2000)
        {
            type= type.filter((problem)=>problem.rating>=val);
        }
        else
        {
            type= type.filter((problem)=>problem.rating==val);
        }
    }
    ele.innerHTML="";
    type.forEach((problem)=>{

        contest_html=document.createElement("tr");
        contest_html.innerHTML=`<td class="column1"><a href=${problem.link} target="_blank">${problem.name}</a></td>
        <td class="column2">${problem.rating}</td>
        <td class="column3">${problem.tags}</td>`;

        ele.appendChild(contest_html);
  });
}
async function get_user(user)
{
    const base_url=`https://codeforces.com/api/user.status?handle=`;
    const response = await fetch(base_url+user);
    if(!response.ok)
    {
        alert("PLEASE ENTER PROPER USER HANDLE");
        return;
    }
    let data = await response.json();

    data = data.result;
    return data;
}
async function get_all_users()
{
    let u1= user1_html.value, u2= user2_html.value;
    let obj={
        user1: [],
        user2: []
    };
    obj.user1= await get_user(u1);
    if(!obj.user1)
        return;
    obj.user2= await get_user(u2);
    if(!obj.user2)
        return;
    return obj;
}
function filter_by_user(all_users)
{
    let user1= all_users.user1;
    let user2= all_users.user2;
    let filtered=user2.filter((sub)=>{
        let temp= user1.filter((sub1)=>{
            return (sub1.problem.contestId==sub.problem.contestId && sub1.problem.index==sub.problem.index);
        });

       return (sub.verdict=="OK" && !temp.some((ele)=>{
           return ele.verdict=="OK";
       }));
    }).map((ele)=>{
        let problem= ele.problem;
        let obj={
            name: problem.name,
            rating: problem.rating,
            tags: problem.tags,
            link: `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`
        }
        return obj;
    });
    return filtered;
}

function user_input()
{
    get_all_users().then((all_users)=>{
        if(!all_users)
        return;
        problem_list=filter_by_user(all_users);
        display();
        let message="This is list of problems solved by " + user2_html.value + " and not solved by " + user1_html.value;
        alert(message);
    });
}
function compare( a, b ) {
  if ( a.rating < b.rating ){
    return -1;
  }
  if ( a.rating > b.rating ){
    return 1;
  }
  return 0;
}
function sortByRating(){
    problem_list.sort(compare)
    display()
}
select_rating.addEventListener('change',display);
user_filter.addEventListener('click',user_input);
ratings.addEventListener('click',sortByRating);
