const express = require("express")
const path = require("path")
const app = express()
// const hbs = require("hbs")
const LogInCollection = require("./mongodb")
const port = process.env.PORT || 3002
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})



// app.get('/home', (req, res) => {
//     res.render('home')
// })

app.post('/signup', async (req, res) => {
    try {
        const users = await LogInCollection.find({ name: req.body.name });
        if (users.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Save the new user
        const newUser = new LogInCollection({
            name: req.body.name,
            password: req.body.password  // You should encrypt the password in a real app
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (check && check.password === req.body.password) {
            // Redirect to the specified URL
            res.status(201).redirect("https://g-dundee-frontend-cx1f.vercel.app//");
        } else {
            res.send("Incorrect password");
        }
    } 
    catch (e) {
        res.send("Wrong details");
    }
});


// app.post('/login', async (req, res) => {

//     try {
//         const check = await LogInCollection.findOne({ name: req.body.name })

//         if (check.password === req.body.password) {
//             res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
//         }

//         else {
//             res.send("incorrect password")
//         }


//     } 
    
//     catch (e) {

//         res.send("wrong details")
        

//     }


// })



app.listen(port, () => {
    console.log('port connected');
})