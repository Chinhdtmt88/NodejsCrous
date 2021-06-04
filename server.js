const fs = require('fs');
const http = require('http');
const url = require('url');

//SERVER
const replaceTemplate = (temp, product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;

}
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf8');
const tempCart = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) =>{
    const pathName = req.url;
    //Overview page
    if(pathName === '/' ||pathName === '/overview'){
        res.writeHead(200, { 'Content-type':'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCart, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);


        res.end(output);

    //Product page
    }else if(pathName === '/product'){
        res.writeHead(200, { 'Content-type':'text/html'});
        res.end(tempProduct);

    //API
    }else if(pathName === '/api'){
        res.writeHead(200, { 'Content-type':'application/json'});
        res.end(tempCart);  

    //Not found
    }else{
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-header': 'hello-word'
        });
        res.end('<h1>Page not found!<h1>');
    }
});

server.listen(8000,'127.0.0.1', () =>{
    console.log('Listen to request on port 8000');
});
