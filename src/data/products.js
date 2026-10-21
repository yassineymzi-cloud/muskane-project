// Fictional demonstration catalogue only. Replace with verified YouCan data.
export const categories = [
  {id:'men', name:'عطور رجالية', note:'تفاصيل تعبّر عن حضورك', tone:'dark', english:'FOR HIM', description:'بين النفحات الخشبية والعنبرية، اكتشف أمثلة لروائح بطابع هادئ ومتوازن.'},
  {id:'women', name:'عطور نسائية', note:'اختر ما يشبه ذوقك', tone:'rose', english:'FOR HER', description:'مساحة لاكتشاف أمثلة من النفحات الزهرية والمسك، واختيار التفاصيل التي تحبّها.'},
  {id:'men-packs', name:'باكات رجالية', note:'أربع روائح، مساحة أوسع للاكتشاف', tone:'amber', english:'DISCOVERY / HIM', description:'تصوّر لباك يجمع أربعة عطور بحجم 10 مل لكل عطر. تجربة صغيرة تساعدك على اكتشاف ذوقك.'},
  {id:'women-packs', name:'باكات نسائية', note:'تجارب صغيرة، اختيارات متجدّدة', tone:'sage', english:'DISCOVERY / HER', description:'تصوّر لباك من أربع تقسيمات عطرية، كل واحدة بحجم 10 مل، للمقارنة والتجربة بهدوء.'},
];
export const products = [
  {id:'amber-noir',name:'عنبر نوار',latin:'AMBRE NOIR',category:'men',price:390,oldPrice:450,tone:'dark',notes:'عنبر · أخشاب · توابل',size:'50 مل',featured:true,demo:true},
  {id:'rose-velours',name:'روز ڤيلور',latin:'ROSE VELOURS',category:'women',price:420,tone:'rose',notes:'ورد · مسك · بتلات ناعمة',size:'50 مل',featured:true,demo:true},
  {id:'bois-intense',name:'بوا أنتنس',latin:'BOIS INTENSE',category:'men',price:360,tone:'amber',notes:'أرز · نجيل الهند · عنبر',size:'50 مل',featured:true,demo:true},
  {id:'musc-lumiere',name:'مسك لوميير',latin:'MUSC LUMIÈRE',category:'women',price:340,oldPrice:400,tone:'sage',notes:'مسك · زهور بيضاء · حمضيات',size:'50 مل',featured:true,demo:true},
  {id:'discovery-him',name:'باك الاكتشاف الرجالي',latin:'DISCOVERY / HIM',category:'men-packs',price:240,tone:'dark',notes:'أربع تجارب عطرية مختلفة',size:'4 × 10 مل',pack:true,demo:true},
  {id:'discovery-her',name:'باك الاكتشاف النسائي',latin:'DISCOVERY / HER',category:'women-packs',price:240,tone:'rose',notes:'أربع تجارب عطرية مختلفة',size:'4 × 10 مل',pack:true,demo:true},
];
