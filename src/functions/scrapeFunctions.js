import cheerio from "cheerio";

export const convertArrayOfObjectsToCSV = (args) => {
  let result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if ( data == null || !data.length ) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';

  keys = Object.keys(data[ 0 ]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function (item){
    ctr = 0;
    keys.forEach(function (key){
      if ( ctr > 0 ) result += columnDelimiter;

      result += item[ key ] ? `"${item[ key ]}"` : "";
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
};

export const  downloadCSV = (filename) => data => {
  let csv = convertArrayOfObjectsToCSV({
    data
  });
  if ( csv == null ) return;

  filename = filename || 'export.csv';

  if ( !csv.match(/^data:text\/csv/i) ) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);

  let link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
};

export const parseResponse = response => {
  const $ = cheerio.load(response.data);

  const results = [];
  $(".jsReviewItem").map((index, reviewItem) =>{

    let itemToadd = {};
    const name = $(reviewItem).find("span[itemprop='author'] span[itemprop='name']").text();
    const datePublished = $(reviewItem).find("span[itemprop='datePublished']").text();
    let reviewBody = $(reviewItem).find("span[itemprop='reviewBody']").text();

    reviewBody = reviewBody.replace(/,|\n/g, ",");
    //reviewBody = reviewBody.replace(/\n/g, "");

    itemToadd = { name, reviewBody, datePublished };

    $(reviewItem).find("div.reviewbox p").map((index, paragraph) =>{
      if ( $(paragraph).find("strong").html() ) {
        const key = $(paragraph).find("strong").html().replace(/\s/g, "").replace(":", "");
        $(paragraph).find("strong").remove();
        const body = $(paragraph).html();
        if ( key.length && body.length ) {
          itemToadd[ key ] = body;
        }
      }
    });


    if ( name.length && reviewBody.length && datePublished.length ) {
      results.push(itemToadd);
    }
  });

  return results;

}