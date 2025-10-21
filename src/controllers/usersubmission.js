


const problem=require("../models/problem");
const submission=require("../models/submission");
const user=require("../models/users")
const {getlanguagebyid,submitbatch,submittoken}=require("../utils/problemutility")

const submitcode=async(req,res)=>{
// user ka id to jb hm usermiddleware se authenticate krenge to pta lg jayega usko hmlog ans1 ke form me rkhe hai wha se yha hm la denge
try{
   const userid=req.ans1.id ;
   const problemid=req.params.id ;
   const {code,language}=req.body; // ye req.body se pta lg jayega jo hm bhejenge 

   if(!userid || !problemid || !code || !language)//i.e. agr undefined aa jaye mtlb ki koi glat data hai 
    return res.status(400).send("some field missing or wrong") 

    if(language==='cpp')
    language='c++';

    // fetch the problem from databse bcz ki hmko ye problem ka hidden testcase bhi to lana padega
    const Problem = await problem.findById(problemid);
    
    if (!Problem) {
        return res.status(404).send("Problem not found");
    }

    if (!Problem.hiddentestcases || Problem.hiddentestcases.length === 0) {
        return res.status(400).send("No hidden test cases found for this problem");
    }

    // submit to judge 0
    const languageid = getlanguagebyid(language);
    
    if (!languageid) {
        return res.status(400).send("Unsupported language");
    }

    //apne submiossion ko db me store kro pehle 
    const submittedresult = await submission.create({
        userid,
        problemid,
        code,
        language,
        status:'pending',   // initially to pending hi krenge n code ko bcoz sare code ko start me db me dal rhe hai 
        testCasesTotal:Problem.hiddentestcases.length 
    })

    // hidden test cases ko dalenge judge o ke ander se to check my code 
    const submissions = Problem.hiddentestcases.map((testcase)=>({
        source_code:code,
        language_id:languageid,
        stdin:testcase.input,
        expected_output:testcase.output
    }));
    
    const submitresult = await submitbatch(submissions); // ye token dega as  a result now batch submission me hm log token to ek array me rakh kr bhejte 
    
    if (!submitresult || !Array.isArray(submitresult)) {
        submittedresult.status = 'error';
        submittedresult.errorMessage = 'Failed to submit code to judge';
        await submittedresult.save();
        return res.status(500).send("Failed to submit code to judge");
    }
    
    const resulttoken = submitresult.map((value)=>value.token)// return in the form of array like that :["dawertyuiopokj","ktredfghjklk","teyrujfcdvbnkgh"]
    
    const testresult = await submittoken(resulttoken);
    
    if (!testresult || !Array.isArray(testresult)) {
        submittedresult.status = 'error';
        submittedresult.errorMessage = 'Failed to get test results';
        await submittedresult.save();
        return res.status(500).send("Failed to get test results");
    }
    
    // pehle ye dekh lenge userproblem me se ki testresult me kya kya a rha hai console.log krne pr 
    // ab submitted result mo update maro

    let testCasesPassed=0,memory=0,runtime=0,status='accepted',errorMessage=null;
    for(const test of testresult){
        if(test.status.id==3){
            testCasesPassed++;
            runtime=runtime+ parseFloat(test.time);
            memory=Math.max(memory,test.memory);
        }
        else{
            if(test.status.id==4){
                status='error'
                errorMessage=test.stderr
            }
            else{
                status='wrong answer'
                errorMessage=test.stderr
            }
        }
    }
    // store updated testresult in db in submission

    submittedresult.status=status; 
    submittedresult.runtime=runtime; 
    submittedresult.memory=memory; 
    submittedresult.errorMessage=errorMessage; 
    submittedresult.testCasesPassed=testCasesPassed; 

    await submittedresult.save();  // db me isko save krdo jo result aaya hai ye jruri hai 

    // Only mark problem as solved if status is "accepted"
    if (status === 'accepted') {
        // Get fresh user data to ensure we have the most up-to-date problemsSolved array
        const currentUser = await user.findById(userid);
        
        console.log(' Accepted submission for user:', userid, 'problem:', problemid);
        console.log('Current problemsSolved before update:', currentUser.problemsSolved);
        
        // Check if this problem is already in the user's solved problems
        if (!currentUser.problemsSolved || !currentUser.problemsSolved.some(p => p.toString() === problemid)) {
            // Add the problem to user's solved problems
            const updatedUser = await user.findByIdAndUpdate(
                userid,
                { $addToSet: { problemsSolved: problemid } },
                { new: true }
            );
            console.log('✨ Added new problem to problemsSolved. Total unique problems:', updatedUser.problemsSolved.length);
        } else {
            console.log('  Problem already in problemsSolved array');
        }
    }

    res.status(201).send(submittedresult);

}
catch(err){
    console.error("Submit code error:", err);
    
    
    if (err.name === 'MongoNetworkError' || err.message.includes('connect')) {
        return res.status(500).send("Database connection failed. Please try again later.");
    }
    
    res.status(500).send("internal server error: " + err.message);
}
}


// run code ke liye same code use hoga submit code jaise bs database me save nhi krana hai submit ke jaise 


const runcode=async(req,res)=>{
// user ka id to jb hm usermiddleware se authenticate krenge to pta lg jayega usko hmlog ans1 ke form me rkhe hai wha se yha hm la denge
try{
   const userid=req.ans1.id ;
   const problemid=req.params.id ;
   const {code,language}=req.body; // ye req.body se pta lg jayega jo hm bhejenge 

   if(!userid || !problemid || !code || !language)//i.e. agr undefined aa jaye mtlb ki koi glat data hai 
    return res.status(400).send("some field missing or wrong") 

   if(language==='cpp')
    language='c++';
    
    // fetch the problem from databse bcz ki hmko ye problem ka hidden testcase bhi to lana pdega
    const Problem = await problem.findById(problemid);
    
    if (!Problem) {
        return res.status(404).send("Problem not found");
    }

    if (!Problem.visibletestcases || Problem.visibletestcases.length === 0) {
        return res.status(400).send("No visible test cases found for this problem");
    }

    // submit to judge 0
    const languageid = getlanguagebyid(language);
    
    if (!languageid) {
        return res.status(400).send("Unsupported language");
    }

    // visible test cases ko dalenge judge o ke ander se to check my code for run kyuki ye testcase sbko dikhta haui
    const submissions = Problem.visibletestcases.map((testcase)=>({
        source_code: code,
        language_id: languageid,
        stdin: testcase.input,
        expected_output: testcase.output
    }));
    
    const submitresult = await submitbatch(submissions); // ye token dega as  a result now batch submission me hm log token to ek array me rakh kr bhejte 
    
    if (!submitresult || !Array.isArray(submitresult)) {
        return res.status(500).send("Failed to submit code to judge");
    }
    
    const resulttoken = submitresult.map((value)=>value.token)// return in the form of array like that :["dawertyuiopokj","ktredfghjklk","teyrujfcdvbnkgh"]
    
    const testresult = await submittoken(resulttoken);
    
    if (!testresult || !Array.isArray(testresult)) {
        return res.status(500).send("Failed to get test results");
    }

    res.status(201).send(testresult);

}
catch(err){
    console.error("Run code error:", err);
    
    // If MongoDB is not connected, return error instead of mock
    if (err.name === 'MongoNetworkError' || err.message.includes('connect')) {
        return res.status(500).send("Database connection failed. Please try again later.");
    }
    
    res.status(500).send("internal server error: " + err.message);
}
}


const getAllSubmissions = async (req, res) => {
    try {
        const userid = req.ans1.id;
        
      
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
       
        const totalSubmissions = await submission.countDocuments({ userid });
        
        
        const submissions = await submission.find({ userid })
            .populate({
                path: 'problemid',
                select: 'title difficulty tags'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        return res.status(200).json({
            submissions,
            pagination: {
                total: totalSubmissions,
                page,
                limit,
                totalPages: Math.ceil(totalSubmissions / limit)
            }
        });
    } catch (err) {
        console.error("Get all submissions error:", err);
        return res.status(500).json({ error: "Failed to retrieve submissions" });
    }
};



module.exports={submitcode, runcode, getAllSubmissions}