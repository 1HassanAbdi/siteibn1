import React, { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import {
    FormControl,
    InputLabel,
    Select,
    Radio,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    CssBaseline,
    Paper,

    AppBar,
    Toolbar,
    TextField,

    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';

import jsonData1 from './data1.json';
import jsonData2 from './data2.json';

function Oqre() {
    const [viewMode, setViewMode] = useState('split'); // 'pdf', 'questionnaire', 'split'

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };
    const [questions, setQuestions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [checkedItems, setCheckedItems] = useState({});
    const [textAnswers, setTextAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [results, setResults] = useState([]);
    const [currentQuestionnaire, setCurrentQuestionnaire] = useState("questions1");

    // LANGUE
    const [currentLanguage, setCurrentLanguage] = useState('fr');

    useEffect(() => {
        const jsonData = currentLanguage === 'en' ? jsonData1 : jsonData2;

        if (jsonData[currentQuestionnaire]) {
            setQuestions(jsonData[currentQuestionnaire]);
        }
    }, [currentLanguage, currentQuestionnaire]);

    const handleSelectChange = (questionId) => (event) => {
        setSelectedOptions({
            ...selectedOptions,
            [questionId]: event.target.value
        });
    };

    const handleCheckboxChange = (questionId) => (event) => {
        setCheckedItems({
            ...checkedItems,
            [questionId]: {
                ...checkedItems[questionId],
                [event.target.name]: event.target.checked
            }
        });
    };

    const handleTextChange = (questionId) => (event) => {
        setTextAnswers({
            ...textAnswers,
            [questionId]: event.target.value
        });
    };

    const calculateScore = () => {
        let totalScore = 0;
        const newResults = [];

        questions.forEach(question => {
            let isCorrect = false;
            let userAnswer = null;
            let correctAnswer = null;

            if (question.type === 'select' || question.type === 'radio') {
                const selectedOption = selectedOptions[question.id];
                if (selectedOption !== undefined) {
                    if (typeof selectedOption === 'string') {
                        if (question.options[question.correctOption] === selectedOption || selectedOption === question.options[question.correctOption].image) {
                            totalScore += question.points;
                            isCorrect = true;
                        }
                    }
                }
                userAnswer = selectedOption;
                correctAnswer = typeof question.options[question.correctOption] === 'string' ? question.options[question.correctOption] : question.options[question.correctOption].image;
            } else if (question.type === 'checkbox') {
                const checkedOptions = checkedItems[question.id] || {};
                const correctOptions = question.correctOptions.map(index => question.options[index]);
                const userCheckedOptions = Object.keys(checkedOptions).filter(option => checkedOptions[option]);
                isCorrect = correctOptions.every(option => userCheckedOptions.includes(option)) && correctOptions.length === userCheckedOptions.length;
                if (isCorrect) {
                    totalScore += question.points;
                }
                userAnswer = userCheckedOptions.join(', ');
                correctAnswer = correctOptions.join(', ');
            } else if (question.type === 'text' || question.type === 'short-text') {
                userAnswer = textAnswers[question.id];
                correctAnswer = question.correctAnswer;
                if (userAnswer && userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
                    totalScore += question.points;
                    isCorrect = true;
                }
            }

            newResults.push({
                question: question.text,
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                points: isCorrect ? question.points : 0
            });
        });

        setScore(totalScore);
        setResults(newResults);
    };

    const handleChangeQuestionnaire = (questionnaire) => {
        setCurrentQuestionnaire(questionnaire);
        setSelectedOptions({});
        setCheckedItems({});
        setTextAnswers({});
        setScore(null);
        setResults([]);
    };

    const handleDownload = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + results.map(result => `${result.question},${result.userAnswer},${result.correctAnswer},${result.points}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "resultats.csv");
        document.body.appendChild(link);
        link.click();
    };

    if (!questions || questions.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ background: " #011610" }}>
           


            <Box display="flex" flexDirection="column" style={{ marginTop: '10px' }}>
                <Box style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Button
                        variant="contained"
                        onClick={() => handleViewChange('pdf')}
                        style={{
                            backgroundColor: '#3f51b5',
                            color: '#fff',
                            fontWeight: 'bold',
                            padding: '10px 20px',
                            fontSize: '16px',
                            borderRadius: '30px',
                            margin: '0 10px',
                        }}
                    >
                        Voir PDF
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleViewChange('questionnaire')}
                        style={{
                            backgroundColor: '#f50057',
                            color: '#fff',
                            fontWeight: 'bold',
                            padding: '10px 20px',
                            fontSize: '16px',
                            borderRadius: '30px',
                            margin: '0 10px',
                        }}
                    >
                        Voir Questionnaire
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleViewChange('split')}
                        style={{
                            backgroundColor: '#4caf50',
                            color: '#fff',
                            fontWeight: 'bold',
                            padding: '10px 20px',
                            fontSize: '16px',
                            borderRadius: '30px',
                            margin: '0 10px',
                        }}
                    >
                        Voir les Deux
                    </Button>
                    <Button
                    onClick={() => setCurrentLanguage(currentLanguage === 'fr' ? 'en' : 'fr')}
                    style={{ marginBottom: '20px', border: '1px solid black',    backgroundColor: '#3f51b5',
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '30px',
                        margin: '0 10px', }}
                >
                    {currentLanguage === 'fr' ? 'Switch to English' : 'Passer en français'}
                </Button>
                </Box>
            </Box>

            <Box display="flex" style={{ flex: 1, padding: '02%' }}>
                {viewMode === 'pdf' || viewMode === 'split' ? (
                    <Box
                        component="div"
                        sx={{
                            width: viewMode === 'split' ? '50%' : '100%',
                            height: 'calc(100vh - 128px)',
                            overflowY: 'auto',
                            borderRight: viewMode === 'split' ? '1px solid #ddd' : 'none',
                            padding: '20px',
                            backgroundColor: 'white',
                        }}
                    >
                        <embed src="/3MathSOL2003.pdf" type="application/pdf" width="100%" height="100%" />
                    </Box>
                ) : null}

                {viewMode === 'questionnaire' || viewMode === 'split' ? (
                    <Box
                        component="div"
                        sx={{
                            marginLeft: viewMode === 'split' ? '2%' : 'auto',
                            marginRight: viewMode === 'split' ? '2%' : 'auto',
                            width: viewMode === 'split' ? '50%' : '60%',
                            height: 'calc(100vh - 128px)',
                            overflowY: 'auto',
                        }}
                    >

                        <Paper style={{ padding: '80px' }}>
                            <Typography variant="h3" gutterBottom style={{ textAlign: 'center', color: "#d32f2f", fontWeight: "bold", fontSize: '2rem' }}>
                                Questionnaire {currentQuestionnaire[currentQuestionnaire.length - 1]}
                            </Typography>


                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <Button variant="outlined" onClick={() => handleChangeQuestionnaire("questions1")}>Questionnaire 1</Button>
                                <Button variant="outlined" onClick={() => handleChangeQuestionnaire("questions2")} style={{ marginLeft: '10px', marginRight: '10px' }}>Questionnaire 2</Button>
                                <Button variant="outlined" onClick={() => handleChangeQuestionnaire("questions3")}>Questionnaire 3</Button>
                            </div>
                            {questions.map((question) => (
                                <div key={question.id} style={{ padding: "20px", fontWeight: "bold" }}>
                                    {question.image && (
                                        <img src={question.image} alt={`Question ${question.id}`} style={{ width: '100%', marginBottom: '20px' }} />
                                    )}
                                    <Typography variant="h6" style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: '10px', textAlign: "center" }}>
                                        {question.text}
                                    </Typography>
                                    {question.type === 'select' && (
                                        <FormControl fullWidth margin="normal" required>
                                            <InputLabel id={`select-label-${question.id}`}>
                                                Sélectionnez une option
                                            </InputLabel>
                                            <Select
                                                labelId={`select-label-${question.id}`}
                                                value={selectedOptions[question.id] || ''}
                                                onChange={handleSelectChange(question.id)}
                                            >
                                                {question.options.map((option, index) => (
                                                    <MenuItem key={index} value={typeof option === 'string' ? option : option.image}>
                                                        {typeof option === 'string' ? option : (
                                                            <img src={option.image} alt={`Option ${index}`} style={{ width: '80px' }} />
                                                        )}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                    {question.type === 'radio' && (
                                        <FormGroup>
                                            {question.options.map((option, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    control={
                                                        <Radio
                                                            checked={selectedOptions[question.id] === (typeof option === 'string' ? option : option.image)}
                                                            onChange={handleSelectChange(question.id)}
                                                            value={typeof option === 'string' ? option : option.image}
                                                            name={`radio-button-${question.id}`}
                                                            color="primary"
                                                        />
                                                    }
                                                    label={typeof option === 'string' ? option : (
                                                        <img src={option.image} alt={`Option ${index}`} style={{ width: '250px' }} />
                                                    )}
                                                />
                                            ))}
                                        </FormGroup>
                                    )}
                                    {question.type === 'checkbox' && (
                                        <FormGroup>
                                            {question.options.map((option, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    control={
                                                        <Checkbox
                                                            checked={checkedItems[question.id]?.[option] || false}
                                                            onChange={handleCheckboxChange(question.id)}
                                                            name={option}
                                                            color="primary"
                                                        />
                                                    }
                                                    label={option}
                                                />
                                            ))}
                                        </FormGroup>
                                    )}
                                    {question.type === 'text' && (
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            margin="normal"
                                            variant="outlined"
                                            label="Votre réponse"
                                            value={textAnswers[question.id] || ''}
                                            onChange={handleTextChange(question.id)}
                                        />
                                    )}
                                    {question.type === 'short-text' && (
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            label="Votre réponse"
                                            value={textAnswers[question.id] || ''}
                                            onChange={handleTextChange(question.id)}
                                        />
                                    )}
                                </div>
                            ))}
                            <div style={{ textAlign: "center" }}>
                                <Button variant="contained" color="primary" onClick={calculateScore}>
                                    Soumettre
                                </Button>
                            </div>
                            {score !== null && (
                                <>
                                    <Typography variant="h5" style={{ marginTop: '20px', color: '#388e3c' }}>
                                        Votre note: {score} / {questions.reduce((total, q) => total + q.points, 0)} points
                                    </Typography>
                                    <TableContainer component={Paper} style={{ marginTop: '20px', backgroundColor: "#f0f0f0" }}>
                                        <Table>
                                            <TableHead style={{ backgroundColor: "#1976d2" }}>
                                                <TableRow>
                                                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Question</TableCell>
                                                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Votre réponse</TableCell>
                                                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Bonne réponse</TableCell>
                                                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Points</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {results.map((result, index) => (
                                                    <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? "#e3f2fd" : "#ffffff" }}>
                                                        <TableCell>{result.question}</TableCell>
                                                        <TableCell>{result.userAnswer}</TableCell>
                                                        <TableCell>{result.correctAnswer}</TableCell>
                                                        <TableCell>{result.points}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <div style={{ textAlign: "center", marginTop: '20px' }}>
                                        <Button variant="contained" color="secondary" onClick={handleDownload}>
                                            Télécharger les résultats
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Paper>
                    </Box>
                ) : null}
            </Box>

        </div>
    );
};

export default Oqre;
