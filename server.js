const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// CORS 허용
app.use(cors());

// JSON 데이터 파싱
app.use(express.json());

// POST /submit API
app.post('/submit', (req, res) => {
  try {
    const { name, email, feedback } = req.body;

    // 필수 필드 검증
    if (!name || !email || !feedback) {
      return res.status(400).json({ 
        error: '모든 필드를 입력해주세요.' 
      });
    }

    // 새로운 데이터 객체
    const newData = {
      id: Date.now(),
      name,
      email,
      feedback,
      submittedAt: new Date().toISOString()
    };

    // data.json 파일 경로
    const dataFilePath = path.join(__dirname, 'data.json');
    
    // 기존 데이터 읽기
    let existingData = [];
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf8');
      if (fileContent.trim()) {
        existingData = JSON.parse(fileContent);
      }
    }

    // 새 데이터 추가
    existingData.push(newData);

    // 파일에 저장
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));

    console.log('새로운 설문 응답:', newData);

    res.status(200).json({ 
      message: '설문 응답이 성공적으로 저장되었습니다.',
      data: newData
    });

  } catch (error) {
    console.error('서버 오류:', error);
    res.status(500).json({ 
      error: '서버 내부 오류가 발생했습니다.' 
    });
  }
});

// GET /results API
app.get('/results', (req, res) => {
  try {
    const dataFilePath = path.join(__dirname, 'data.json');
    
    if (!fs.existsSync(dataFilePath)) {
      return res.status(200).json([]);
    }

    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    
    if (!fileContent.trim()) {
      return res.status(200).json([]);
    }

    const data = JSON.parse(fileContent);
    res.status(200).json(data);

  } catch (error) {
    console.error('데이터 조회 오류:', error);
    res.status(500).json({ 
      error: '데이터를 불러올 수 없습니다.' 
    });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});