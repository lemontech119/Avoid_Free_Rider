let obj = {test:10}
let obj2 = {test:10}

let obj_copy =obj;

console.log(obj === obj2)
console.log(obj === obj_copy)

obj.test2 = "11"
console.log(obj);
console.log(obj_copy);
console.log(obj === obj_copy)

obj_copy.test3 ="12"
console.log(obj);
console.log(obj_copy);
console.log(obj === obj_copy)
const sampleCarList = [{
    carNumber: '11주1111',
    owner: '홍길동',
    model: 'SONATA',
    company: 'HYUNDAI',
    numOfAccident: 2,
    numOfOwnerChange: 1
},
{
    carNumber: '22주2222',
    owner: '손오공',
    model: 'MORNING',
    company: 'KIA',
    numOfAccident: 1,
    numOfOwnerChange: 3
}
];


console.log(sampleCarList);
console.log(typeof(sampleCarList));


let yyyy= "PxztJni9omYpnZkZnPHGKnnlp1KI738WDiZx6Pw26Eh55f/zv2OTuq5FLI8BpmIjQW2sg3M0NG0sf6//cO2wzf/9M3PDmo14jan7IjfVT4Hl9OiR/dVulBCMjC8qU1522Lb3t/Los2+Kcx5amp0b0RnufYCmCJ7Siga5Y5snnZg="
