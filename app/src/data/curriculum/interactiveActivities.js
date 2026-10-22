// Curriculum-grounded formative practice. Editorial NB.5 examples, with a
// conservative Scripture-to-purpose match available for every other standard.
// Practice is NOT a mastery assessment or an approval of external media.
import { getLessonExperience } from '../../core/classroom/content/lessonExperience.js';

const curated = {
  'NB.5.1.18': [
    {
      id:'nb51-order', kind:'order', title:'Put Pentecost in sequence',
      instruction:'Read Acts 2:36–38. Arrange what the listeners heard and how Peter answered.',
      reference:'Acts 2:36–38',
      items:[
        {id:'preach',text:'Peter proclaims Jesus as Lord and Christ.'},
        {id:'ask',text:'The listeners ask, “What shall we do?”'},
        {id:'respond',text:'Peter commands repentance and baptism in Jesus Christ’s name.'}
      ],
      correctFeedback:'The gospel was proclaimed, the listeners responded, and Peter gave the apostolic command.',
      incorrectFeedback:'Read Acts 2:36, then verse 37, then verse 38. The question comes before Peter’s reply.'
    },
    {
      id:'nb51-match', kind:'match', title:'Connect the Scripture to its teaching',
      instruction:'Match each passage to what it explicitly teaches about baptism.',
      pairs:[
        {id:'acts2',label:'Acts 2:38',meaning:'Repentance and baptism are commanded together.'},
        {id:'acts8',label:'Acts 8:12–16',meaning:'Believers in Samaria received water baptism.'},
        {id:'rom6',label:'Romans 6:3–4',meaning:'Baptism is connected to Christ’s death and burial.'}
      ],
      correctFeedback:'These passages show baptism in proclamation, practice, and apostolic explanation.',
      incorrectFeedback:'Check the passages: command in Acts 2, practice in Acts 8, explanation in Romans 6.'
    },
    {
      id:'nb51-blank', kind:'blank', title:'Complete Peter’s command',
      instruction:'Choose the words found in Acts 2:38 (KJV).',
      reference:'Acts 2:38',
      before:'Repent, and be baptized every one of you in the name of ',
      after:' for the remission of sins',
      options:['Jesus Christ','Peter','John the Baptist'],answer:'Jesus Christ',
      correctFeedback:'Peter specified the name of Jesus Christ; the name is not an incidental detail.',
      incorrectFeedback:'Return to Acts 2:38 and read the exact name Peter proclaimed.'
    }
  ],
  'NB.5.2.18': [
    {
      id:'nb52-match',kind:'match',title:'How baptism relates to the gospel',
      instruction:'Pair each expression with the explanation in Romans 6:3–4.',
      pairs:[
        {id:'death',label:'Baptized into his death',meaning:'Identification with the death of Christ.'},
        {id:'burial',label:'Buried with him by baptism',meaning:'Baptism is associated with Christ’s burial.'},
        {id:'life',label:'Walk in newness of life',meaning:'The risen life follows the old way of life.'}
      ],
      correctFeedback:'Death, burial and new life belong together in Paul’s explanation.',
      incorrectFeedback:'Follow Paul’s movement through Romans 6:3–4: death, burial, resurrection life.'
    }
  ],
  'NB.5.3.18': [
    {
      id:'nb53-match',kind:'match',title:'Three biblical connections',
      instruction:'Connect each biblical passage with the language used there.',
      pairs:[
        {id:'remission',label:'Acts 2:38',meaning:'Remission of sins in the baptismal command.'},
        {id:'washing',label:'Acts 22:16',meaning:'Wash away thy sins, calling on the name of the Lord.'},
        {id:'regeneration',label:'Titus 3:5',meaning:'The washing of regeneration and renewing of the Holy Ghost.'}
      ],
      correctFeedback:'Keep the passages together without attributing saving power to water apart from God.',
      incorrectFeedback:'Read the precise words in Acts 2:38, Acts 22:16 and Titus 3:5.'
    }
  ],
  'NB.5.4.18': [
    {
      id:'nb54-blank',kind:'blank',title:'The name the apostles used',
      instruction:'Fill the blank using Acts 19:5 (KJV).',
      reference:'Acts 19:5',
      before:'When they heard this, they were baptized in the name of the ',
      after:'.',
      options:['Lord Jesus','apostle Paul','Holy Spirit'],answer:'Lord Jesus',
      correctFeedback:'Acts 19:5 explicitly names the Lord Jesus. Compare Acts 2:38, 8:16 and 10:48.',
      incorrectFeedback:'Read Acts 19:5 again and notice whose name is actually recorded.'
    }
  ],
  'NB.5.5.18': [
    {
      id:'nb55-sort',kind:'sort',title:'Gospel event or gospel response?',
      instruction:'Sort these items. The gospel event is what Jesus accomplished; the response is what Peter commanded at Pentecost.',
      groups:[{id:'event',label:'Christ’s saving work'},{id:'response',label:'Apostolic response'}],
      items:[
        {id:'death',text:'Jesus Christ died',group:'event'},
        {id:'burial',text:'Jesus Christ was buried',group:'event'},
        {id:'baptism',text:'Be baptized in Jesus Christ’s name',group:'response'},
        {id:'repent',text:'Repent',group:'response'}
      ],
      correctFeedback:'Christ accomplished the gospel; the apostles proclaimed the response. Do not confuse or separate them.',
      incorrectFeedback:'1 Corinthians 15:3–4 describes the gospel events. Acts 2:38 gives the apostolic response.'
    }
  ],
  'NB.5.6.18': [
    {
      id:'nb56-order',kind:'order',title:'Follow an immediate baptism',
      instruction:'Put the events of the Ethiopian official’s account in the order recorded in Acts 8:35–38.',
      reference:'Acts 8:35–38',
      items:[
        {id:'preach',text:'Philip preaches Jesus to the traveler.'},
        {id:'water',text:'The traveler sees water and asks about baptism.'},
        {id:'stop',text:'The chariot is stopped.'},
        {id:'baptize',text:'Both enter the water and Philip baptizes him.'}
      ],
      correctFeedback:'The account connects hearing the gospel with prompt baptismal obedience.',
      incorrectFeedback:'Read Acts 8:35–38 in order; first comes proclamation, then the water and the request.'
    }
  ]
};

export function getInteractiveActivities(content) {
  if (!content?.sourceStandard) return [];
  if (curated[content.standardId]) return curated[content.standardId];
  const witnesses=getLessonExperience(content).witnesses;
  // These descriptions come from the *actual curriculum* and are not AI-generated claims.
  const pairs=witnesses.slice(0,3).map((v,i)=>({
    id:'w'+i,label:v.reference,meaning:v.function
  }));
  if (pairs.length<2 || new Set(pairs.map(x=>x.meaning)).size!==pairs.length) return [];
  return [{
    id:'scripture-match-'+content.standardId,kind:'match',
    title:'Connect the biblical witnesses',
    instruction:'Match each Scripture reference with its purpose in this lesson’s curriculum.',
    pairs,
    correctFeedback:'Good work connecting the references to the curriculum’s teaching goals. Read each passage in context.',
    incorrectFeedback:'Review the three references in the lesson above, then try matching them again.'
  }];
}

export function evaluateInteractiveActivity(activity,answers={}) {
  if (!activity) return false;
  if (activity.kind==='match') return activity.pairs.every(p=>answers[p.id]===p.id);
  if (activity.kind==='sort') return activity.items.every(p=>answers[p.id]===p.group);
  if (activity.kind==='blank') return answers.choice===activity.answer;
  if (activity.kind==='order') return Array.isArray(answers.order)
    && answers.order.length===activity.items.length
    && activity.items.every((p,i)=>answers.order[i]===p.id);
  return false;
}
