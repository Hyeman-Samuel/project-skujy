async function paginateModel(Page,Model){
  if(Page||Page<0)Page=0;
  var CurrentPage=Math.trunc(Page);
  const ModelCount=await Model.count();
  return pagination(CurrentPage,ModelCount);
  }

function  paginateArray(Page,arrayOfItems){
    const ArrayCount=arrayOfItems.length;
   return pagination(Page,ArrayCount);
  }
function pagination(Page,count){
  var NumberPerPage=10;
  var PagesCount=Math.trunc((count/15)+1);
  var NextPage=Page+1;
  var PrevPage=Page-1;
  var Pages=[];
  var PrevNextButton={}
  for (let index = 0; index < PagesCount; index++) {
    Pages.push(index)
  }
  if(PrevPage <0){
   PrevNextButton.IsFirstPage=true
  }
  PrevNextButton.IsLastPage=true;
if((NextPage) <= PagesCount){
   PrevNextButton.IsLastPage=false;
  }
  return {PagesCount,NextPage,PrevPage,Pages,NumberPerPage,Page,PrevNextButton};
}
  module.exports={paginateModel,paginateArray};