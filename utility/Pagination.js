async function paginateModel(Page,ModelCount,NumberPerPage){
  if((!Page)||(Page<=0)){Page=1;}
 return pagination(Page,ModelCount,NumberPerPage);
}

function  paginateArray(Page,arrayOfItems,NumberPerPage){
  const ArrayCount=arrayOfItems.length;
  if((!Page)||(Page<=0)){Page=1;}
  if(Page >= arrayOfItems.length){
    Page = arrayOfItems.length
  }
 return pagination(Page,ArrayCount,NumberPerPage);
}


function pagination(Page,count,NumberPerPage){
var PagesCount=Math.ceil((count/NumberPerPage));
var NextPage=Number(Page) + 1;
var PrevPage=Math.trunc(Page-1);
var Pages=[];

var traverser = 0
var startPage = 1
for (let index = 0; index < count; index++) {
   traverser++  
  var page ={"index":index+1,
              "page":startPage}
  Pages.push(page)
  if(traverser == NumberPerPage){
    traverser=0;
    startPage++;
  }

}

if(PrevPage < 1){
  PrevPage = null
}
if(NextPage > PagesCount){
    NextPage = null
}

return {PagesCount,Pages,NextPage,PrevPage,NumberPerPage,Page};
}
module.exports={paginateModel,paginateArray};