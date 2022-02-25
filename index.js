const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
const fs = require('fs');
const dataj = fs.readFileSync("./database.json");
const parseData = JSON.parse(dataj);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host:parseData.host,
    user:parseData.user,
    password:parseData.password,
    port:parseData.port,
    database:parseData.database
})

app.use(express.json())
app.use(cors())
//게시글 전체 조회
app.get('/customers' ,async (req, res)=> {
    connection.query(
        "SELECT * FROM customers",
        (err, rows, fields) => {
            res.send(rows);
        }
    )
})

app.get('/customer/:id' ,async(req,res)=> {
    const param = req.params;
    connection.query(
        `SELECT * FROM customers where c_no = ${param.id}`,
        (err,rows,fields) => {
            res.send(rows);
        }
    )
})

app.post('/addCustomer',async(req,res) => {
    const {c_name,c_gender,c_number1,c_number2,c_gardian,c_addr,c_addrdetail,c_phone,c_job,c_desc} = req.body;
    const c_add = `${c_addr} ${c_addrdetail}`;
    connection.query('insert into customers(c_name,c_gender,c_number1,c_number2,c_gardian,c_addr,c_phone,c_job,c_desc) values(?,?,?,?,?,?,?,?,?);',
    [c_name,c_gender,c_number1,c_number2,c_gardian,c_add,c_phone,c_job,c_desc],
    function(err,result,fields){
        console.log(result);
    })
    res.send('완료')
})

app.delete('/customer/:id',async(req,res) => {
    const params = req.params;
    console.log('삭제');
    connection.query(
        `delete FROM customers where c_no = ${params.id}`,
        (err,rows,fields) => {
            res.send(rows);
        }
    )
})

app.put('/editCustomer/:id',async(req,res) => {
    const param = req.params;
    const {c_name,c_gender,c_number1,c_number2,c_gardian,c_addr,c_phone,c_job,c_desc} = req.body;
    connection.query(`update customers set c_name='${c_name}',c_gender='${c_gender}',c_number1='${c_number1}',c_number2='${c_number2}',c_gardian='${c_gardian}',c_addr='${c_addr}',c_phone='${c_phone}',c_job='${c_job}',c_desc='${c_desc}' where c_no=${param.id}`,
    function (err,result,fields){
        console.log(result,err);
    })
})

app.listen(port,()=>{
    console.log('서버가 돌아가고 있습니다.')
})