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
