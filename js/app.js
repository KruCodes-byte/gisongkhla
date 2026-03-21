(() => {
  const STORAGE_KEY = "softpower-songkhla-state-v2";
  const DEMO_EMAIL = "guest@softpower-songkhla.local";
  const ROUTE_MIGRATIONS = {
    singhanakhon: "chana",
  };

  const QUIZ_BANK = {
    "hat-yai": [
      {
        text: "ส้มโอหอมควนลังเป็นผลไม้ที่มีชื่อเสียงของอำเภอและจังหวัดใด?",
        options: [
          "อำเภอเมือง จ.สงขลา",
          "อำเภอหาดใหญ่ จ.สงขลา",
          "อำเภอควนเนียง จ.สงขลา",
          "อำเภอนาทวี จ.สงขลา",
        ],
        correctAnswer: "อำเภอหาดใหญ่ จ.สงขลา",
      },
      {
        text: "สถานการณ์ปัจจุบันของต้นส้มโอหอมควนลังพันธุ์แท้ดั้งเดิมเป็นอย่างไร?",
        options: [
          "มีจำนวนเพิ่มขึ้นอย่างรวดเร็ว",
          "มีจำนวนคงที่จากในอดีต",
          "เหลืออยู่ไม่เกิน 1,500 ต้น",
          "สูญพันธุ์ไปหมดแล้วจากพื้นที่",
        ],
        correctAnswer: "เหลืออยู่ไม่เกิน 1,500 ต้น",
      },
      {
        text: 'เหตุผลสำคัญที่ทำให้ส้มโอหอมควนลัง "ไม่กลายพันธุ์" คือข้อใด?',
        options: [
          "มีการปลูกในดินเฉพาะถิ่นเท่านั้น",
          "มีความทนทานต่อสภาพอากาศสูง",
          "เป็นส้มโอที่ไม่มีเมล็ด",
          "มีการใช้สารเคมีควบคุมพันธุกรรม",
        ],
        correctAnswer: "เป็นส้มโอที่ไม่มีเมล็ด",
      },
      {
        text: "วิธีการขยายพันธุ์ส้มโอหอมควนลังที่นิยมใช้เพียงอย่างเดียวคือวิธีใด?",
        options: ["การเพาะเมล็ด", "การตอนกิ่ง", "การติดตา", "การเสียบยอด"],
        correctAnswer: "การตอนกิ่ง",
      },
      {
        text: "รสชาติที่เป็นจุดเด่นของส้มโอหอมควนลังคือลักษณะใด?",
        options: [
          "หวานจัดจนแสบคอ",
          "เปรี้ยวจี๊ดนำเด่น",
          "หวานอมเปรี้ยว ไม่เลี่ยนไม่ขม",
          "รสจืดและมีกลิ่นฉุน",
        ],
        correctAnswer: "หวานอมเปรี้ยว ไม่เลี่ยนไม่ขม",
      },
      {
        text: 'ลักษณะของเนื้อผลหรือ "กุ้ง" ของส้มโอหอมควนลังมีสีอะไร?',
        options: ["สีขาวใส", "สีเหลืองทอง", "สีชมพูอมแดงถึงสีแดงเข้ม", "สีเขียวอ่อน"],
        correctAnswer: "สีชมพูอมแดงถึงสีแดงเข้ม",
      },
      {
        text: "ลักษณะการรับประทานในข้อใดที่เป็นจุดเด่นของส้มโอชนิดนี้?",
        options: [
          "เนื้อล่อนออกจากเปลือกแกะกินง่าย",
          "ต้องคั้นน้ำทานเท่านั้นเพราะเนื้อแข็ง",
          "เนื้อติดเปลือกแน่นต้องใช้ช้อนขูด",
          "มีเมล็ดจำนวนมากต้องคอยระวัง",
        ],
        correctAnswer: "เนื้อล่อนออกจากเปลือกแกะกินง่าย",
      },
      {
        text: "ส้มโอหอมควนลังมีอายุยืนยาวและให้ผลผลิตต่อเนื่องยาวนานอย่างน้อยกี่ปี?",
        options: ["10 ปี", "20 ปี", "30 ปี", "50 ปี"],
        correctAnswer: "30 ปี",
      },
      {
        text: 'ข้อใดคือ "ลักษณะประจำพันธุ์" ที่เด่นชัดที่สุดของส้มโอหอมควนลัง?',
        options: [
          "ผลมีขนาดใหญ่ยักษ์กว่าพันธุ์อื่น",
          "เนื้อสีชมพูเข้ม ไม่มีเมล็ด และมีกลิ่นหอมเฉพาะตัว",
          "เปลือกมีหนามเล็กน้อยรอบผล",
          "ออกดอกและผลเฉพาะในฤดูหนาวเท่านั้น",
        ],
        correctAnswer: "เนื้อสีชมพูเข้ม ไม่มีเมล็ด และมีกลิ่นหอมเฉพาะตัว",
      },
      {
        text: "จากข้อมูล ปัจจุบันมีผู้ปลูกส้มโอหอมควนลังพันธุ์แท้เหลืออยู่ประมาณกี่ราย?",
        options: ["ประมาณ 10 ราย", "ประมาณ 50 ราย", "ประมาณ 100 ราย", "มากกว่า 500 ราย"],
        correctAnswer: "ประมาณ 50 ราย",
      },
    ],
    chana: [
      {
        text: "ส้มจุกจะนะเริ่มมีการนำเมล็ดเข้ามาเพาะปลูกในพื้นที่อำเภอจะนะในช่วงสมัยของเจ้าเมืองท่านใด?",
        options: [
          "พระยาวิเชียรศรี (เถี่ยนเส้ง)",
          "พระมหานุภาพปราบสงคราม (ขวัญจะ)",
          "เจ้าเมืองไทรบุรี",
          "เจ้าเมืองกลันตัน",
        ],
        correctAnswer: "พระมหานุภาพปราบสงคราม (ขวัญจะ)",
      },
      {
        text: 'ลักษณะภายนอกที่โดดเด่นและเป็นที่มาของชื่อ "ส้มจุก" คือข้อใด?',
        options: [
          "ผลมีขนาดใหญ่ยักษ์",
          "ผิวผลขรุขระเหมือนมะกรูด",
          "ขั้วผลมีจุกยื่นออกมา",
          "ผลมีสีส้มเข้มจัดตลอดทั้งปี",
        ],
        correctAnswer: "ขั้วผลมีจุกยื่นออกมา",
      },
      {
        text: "ข้อใดคือลักษณะภายในของเนื้อส้มจุกจะนะตามที่ระบุในประวัติศาสตร์?",
        options: [
          "เนื้อสีชมพูเข้ม ไส้ตัน",
          "เนื้อสีแดงสด รสหวานจัด",
          "เนื้อสีเหลืองนวลคล้ายน้ำผึ้ง ไส้กลวง",
          "เนื้อสีขาวใส มีเมล็ดจำนวนมาก",
        ],
        correctAnswer: "เนื้อสีเหลืองนวลคล้ายน้ำผึ้ง ไส้กลวง",
      },
      {
        text: "จุดเด่นที่เป็นเอกลักษณ์เฉพาะตัวที่ทำให้ส้มจุกจะนะแตกต่างจากส้มเปลือกล่อนชนิดอื่นคืออะไร?",
        options: [
          "มีขนาดผลที่เล็กที่สุด",
          "มีกลิ่นหอมที่เป็นเอกลักษณ์เฉพาะตัว",
          "มีเปลือกที่หนาและแข็งมาก",
          "สามารถปลูกได้ในดินทุกประเภท",
        ],
        correctAnswer: "มีกลิ่นหอมที่เป็นเอกลักษณ์เฉพาะตัว",
      },
      {
        text: "ในอดีต (พ.ศ. 2400-2490) ตลาดกลางซื้อขายส้มจุกจะนะตั้งอยู่บริเวณใดเพื่อความสะดวกในการขนส่ง?",
        options: [
          "ใกล้ท่าเรือสงขลา",
          "ใกล้สถานีรถไฟจะนะ",
          "บริเวณหน้าศาลากลางจังหวัด",
          "บริเวณตลาดนัดวันอาทิตย์",
        ],
        correctAnswer: "ใกล้สถานีรถไฟจะนะ",
      },
      {
        text: "การบรรจุส้มจุกจะนะเพื่อจำหน่ายเป็นของฝากในสมัยก่อนนิยมทำในลักษณะใด?",
        options: [
          "ใส่ลังไม้สน",
          "ห่อด้วยกระดาษหนังสือพิมพ์",
          "ใส่ชะลอมไม้ไผ่หรือร้อยเป็นพวงตรงจุก",
          "บรรจุในถุงพลาสติกเจาะรู",
        ],
        correctAnswer: "ใส่ชะลอมไม้ไผ่หรือร้อยเป็นพวงตรงจุก",
      },
      {
        text: "ส้มจุกจะนะปรากฏอยู่ในส่วนใดของคำขวัญอำเภอจะนะ?",
        options: ["นกเขาเงินล้าน", "หอมหวานส้มจุก", "แดนมรดกสองวัฒนธรรม", "เมืองเกษตรก้าวหน้า"],
        correctAnswer: "หอมหวานส้มจุก",
      },
      {
        text: "สาเหตุสำคัญที่ทำให้พื้นที่ปลูกส้มจุกจะนะลดลงในอดีตคือข้อใด?",
        options: [
          "ขาดแคลนแรงงานในการเก็บเกี่ยว",
          "รสชาติไม่เป็นที่นิยมของตลาด",
          "ปัญหาโรค แมลง และเกษตรกรหันไปปลูกพืชอื่น เช่น ยางพารา",
          "รัฐบาลสั่งห้ามปลูกเนื่องจากเป็นพืชสงวน",
        ],
        correctAnswer: "ปัญหาโรค แมลง และเกษตรกรหันไปปลูกพืชอื่น เช่น ยางพารา",
      },
      {
        text: "ปี พ.ศ. ใดที่อำเภอจะนะเริ่มมีการส่งเสริมและฟื้นฟูการปลูกส้มจุกจะนะอย่างจริงจังอีกครั้ง?",
        options: ["พ.ศ. 2358", "พ.ศ. 2492", "พ.ศ. 2554", "พ.ศ. 2560"],
        correctAnswer: "พ.ศ. 2554",
      },
      {
        text: 'หน่วยงานใดต่อไปนี้ "ไม่มี" ระบุในข้อมูลว่าเป็นผู้ร่วมฟื้นฟูการปลูกส้มจุกจะนะ?',
        options: [
          "กรมวิชาการเกษตร",
          "มหาวิทยาลัยสงขลานครินทร์",
          "กรมส่งเสริมการเกษตร",
          "กระทรวงการต่างประเทศ",
        ],
        correctAnswer: "กระทรวงการต่างประเทศ",
      },
    ],
    "mueang-songkhla": [
      {
        text: '"ปลากะพงสามน้ำทะเลสาบสงขลา" แท้จริงแล้วคือปลาชนิดใด?',
        options: ["ปลากะพงแดง", "ปลากะพงขาว", "ปลากะพงดำ", "ปลากะพงลาย"],
        correctAnswer: "ปลากะพงขาว",
      },
      {
        text: "แหล่งเลี้ยงปลากะพงสามน้ำที่มีชื่อเสียงที่สุดในจังหวัดสงขลาตั้งอยู่ที่ใด?",
        options: ["เกาะหนู", "เกาะแมว", "เกาะยอ", "เกาะราบ"],
        correctAnswer: "เกาะยอ",
      },
      {
        text: 'คำว่า "สามน้ำ" ในชื่อของปลากะพงชนิดนี้ หมายถึงน้ำประเภทใดบ้าง?',
        options: ["น้ำฝน น้ำคลอง น้ำทะเล", "น้ำตก น้ำบ่อ น้ำนิ่ง", "น้ำจืด น้ำกร่อย น้ำเค็ม", "น้ำบาดาล น้ำประปา น้ำโคลน"],
        correctAnswer: "น้ำจืด น้ำกร่อย น้ำเค็ม",
      },
      {
        text: "ลักษณะเด่นทางกายภาพของเนื้อปลากะพงสามน้ำคือข้อใด?",
        options: ["เนื้อยุ่ยและนิ่มมาก", "เนื้อแน่นและรสชาติหวาน", "เนื้อเหนียวและมีมันมาก", "เนื้อมีสีคล้ำและรสเค็มจัด"],
        correctAnswer: "เนื้อแน่นและรสชาติหวาน",
      },
      {
        text: 'จุดเด่นด้าน "กลิ่น" ของปลากะพงสามน้ำที่แตกต่างจากปลาที่เลี้ยงในแหล่งอื่นคืออะไร?',
        options: ["มีกลิ่นหอมสมุนไพร", "มีกลิ่นโคลนแรง", "ไม่มีกลิ่นคาว", "มีกลิ่นเค็มของไอทะเล"],
        correctAnswer: "ไม่มีกลิ่นคาว",
      },
      {
        text: "กรมทรัพย์สินทางปัญญาได้ประกาศขึ้นทะเบียนปลากะพงสามน้ำเป็นสินค้าประเภทใด?",
        options: ["สินค้า OTOP 5 ดาว", "สินค้ามาตรฐานส่งออก (ISO)", "สิ่งบ่งชี้ทางภูมิศาสตร์ (GI)", "มรดกโลกทางวัฒนธรรม"],
        correctAnswer: "สิ่งบ่งชี้ทางภูมิศาสตร์ (GI)",
      },
      {
        text: "ปลากะพงสามน้ำทะเลสาบสงขลาได้รับการขึ้นทะเบียน GI เมื่อวันที่เท่าไหร่?",
        options: ["1 มกราคม พ.ศ. 2565", "12 สิงหาคม พ.ศ. 2565", "28 กันยายน พ.ศ. 2565", "5 ธันวาคม พ.ศ. 2565"],
        correctAnswer: "28 กันยายน พ.ศ. 2565",
      },
      {
        text: "ทำไมปลากะพงในพื้นที่เกาะยอถึงมีคุณภาพโดดเด่นกว่าพื้นที่อื่น?",
        options: [
          "เพราะเลี้ยงด้วยอาหารนำเข้า",
          "เพราะเป็นจุดบรรจบของน้ำ 3 ชนิดตามธรรมชาติ",
          "เพราะมีการเปิดเพลงให้ปลาฟังขณะเลี้ยง",
          "เพราะน้ำในทะเลสาบสงขลาไม่มีคลื่นลม",
        ],
        correctAnswer: "เพราะเป็นจุดบรรจบของน้ำ 3 ชนิดตามธรรมชาติ",
      },
      {
        text: "ปลากะพงสามน้ำเป็นผลผลิตที่ขึ้นชื่อของอำเภอใดในจังหวัดสงขลา?",
        options: ["อำเภอหาดใหญ่", "อำเภอสะเดา", "อำเภอเมือง", "อำเภอระโนด"],
        correctAnswer: "อำเภอเมือง",
      },
      {
        text: "ข้อใดสรุปถึงความสำคัญของปลากะพงสามน้ำได้ถูกต้องที่สุดตามเนื้อหา?",
        options: [
          "เป็นปลาที่หายากที่สุดในโลก",
          "เป็นสินค้าที่มีคุณภาพโดดเด่นและเป็นที่ต้องการของตลาด",
          "เป็นปลาที่เลี้ยงได้เฉพาะในน้ำจืดสนิทเท่านั้น",
          "เป็นปลาที่มีราคาถูกที่สุดในบรรดาปลาน้ำเค็ม",
        ],
        correctAnswer: "เป็นสินค้าที่มีคุณภาพโดดเด่นและเป็นที่ต้องการของตลาด",
      },
    ],
    "sathing-phra": [
      {
        text: "มะม่วงเบาสงขลาเป็นผลไม้อัตลักษณ์ที่อยู่คู่กับพื้นที่จังหวัดสงขลามานานกว่ากี่ปี?",
        options: ["20 ปี", "50 ปี", "80 ปี", "100 ปี"],
        correctAnswer: "100 ปี",
      },
      {
        text: "พื้นที่หลักในการปลูกมะม่วงเบาสงขลาคือบริเวณใด?",
        options: ["คาบสมุทรสทิงพระ", "ลุ่มน้ำปากพนัง", "เทือกเขาบรรทัด", "เกาะยอ"],
        correctAnswer: "คาบสมุทรสทิงพระ",
      },
      {
        text: "ข้อใดคืออำเภอที่อยู่ในแหล่งปลูกสำคัญของมะม่วงเบาสงขลาตามที่ระบุในข้อมูล?",
        options: ["อำเภอหาดใหญ่", "อำเภอสะเดา", "อำเภอสิงหนคร", "อำเภอนาทวี"],
        correctAnswer: "อำเภอสิงหนคร",
      },
      {
        text: "สภาพดินในบริเวณที่ปลูกมะม่วงเบาสงขลามีลักษณะพิเศษอย่างไร?",
        options: [
          "ดินเหนียวจัดระบายน้ำยาก",
          "ดินร่วนปนทรายและมีซากเปลือกหอยทับถม",
          "ดินลูกรังสีแดงเข้ม",
          "ดินพรุที่มีค่าเป็นกรดสูง",
        ],
        correctAnswer: "ดินร่วนปนทรายและมีซากเปลือกหอยทับถม",
      },
      {
        text: "เพราะเหตุใดมะม่วงเบาสงขลาจึงสามารถให้ผลผลิตได้ตลอดทั้งปี?",
        options: [
          "เพราะมีการใช้สารเร่งดอกเข้มข้น",
          "เพราะสภาพภูมิอากาศร้อนชื้นและพื้นที่ปลูกที่เหมาะสม",
          "เพราะเป็นสายพันธุ์ตัดต่อพันธุกรรม",
          "เพราะปลูกในโรงเรือนควบคุมอุณหภูมิ",
        ],
        correctAnswer: "เพราะสภาพภูมิอากาศร้อนชื้นและพื้นที่ปลูกที่เหมาะสม",
      },
      {
        text: 'ลักษณะทางกายภาพของผลมะม่วงเบาสงขลาข้อใด "ถูกต้อง"?',
        options: [
          "ผลมีขนาดใหญ่ยักษ์ ทรงยาว",
          "ก้านช่อยาว พวงเล็ก",
          "ผลขนาดเล็ก ทรงกลมแกมรี พวงใหญ่",
          "เปลือกหนา สีเขียวเข้ม ไม่มีกลิ่น",
        ],
        correctAnswer: "ผลขนาดเล็ก ทรงกลมแกมรี พวงใหญ่",
      },
      {
        text: "รสชาติและเนื้อสัมผัสที่เป็นเอกลักษณ์ของมะม่วงเบาสงขลาคือข้อใด?",
        options: [
          "รสหวานจัด เนื้อนิ่มเละ",
          "รสจืด เนื้อสากเป็นเสี้ยน",
          "รสเปรี้ยว เนื้อสีขาว แน่น และกรอบ",
          "รสขมอมหวาน เนื้อสีเหลืองเข้ม",
        ],
        correctAnswer: "รสเปรี้ยว เนื้อสีขาว แน่น และกรอบ",
      },
      {
        text: "ผลิตภัณฑ์แปรรูปจากมะม่วงเบาสงขลาที่ขึ้นชื่อและระบุในข้อมูลคือข้อใด?",
        options: [
          "มะม่วงกวนและมะม่วงแผ่น",
          "มะม่วงเบาแช่อิ่มและมะม่วงเบาดองเกลือ",
          "น้ำมะม่วงสกัดเย็น",
          "มะม่วงเบาอบแห้งพลังงานแสงอาทิตย์",
        ],
        correctAnswer: "มะม่วงเบาแช่อิ่มและมะม่วงเบาดองเกลือ",
      },
      {
        text: "หน่วยงานใดที่มีบทบาทสำคัญในการส่งเสริมการสร้างผลไม้อัตลักษณ์จนนำไปสู่การขึ้นทะเบียน GI?",
        options: ["กรมปศุสัตว์", "กรมส่งเสริมการเกษตร", "กรมป่าไม้", "กรมประมง"],
        correctAnswer: "กรมส่งเสริมการเกษตร",
      },
      {
        text: "การดำเนินงานส่งเสริมผลไม้อัตลักษณ์เพื่อเข้าสู่การเป็นสินค้า GI เริ่มดำเนินการมาตั้งแต่ปี พ.ศ. ใด?",
        options: ["พ.ศ. 2555", "พ.ศ. 2560", "พ.ศ. 2562", "พ.ศ. 2565"],
        correctAnswer: "พ.ศ. 2562",
      },
    ],
    ranot: [
      {
        text: "ไข่ครอบสงขลาได้รับการประกาศขึ้นทะเบียนเป็นสิ่งบ่งชี้ทางภูมิศาสตร์ (GI) เมื่อวันที่เท่าไหร่?",
        options: ["1 มกราคม 2565", "6 มิถุนายน 2565", "28 กันยายน 2565", "1 ธันวาคม 2566"],
        correctAnswer: "6 มิถุนายน 2565",
      },
      {
        text: "พื้นที่การผลิตและแปรรูปไข่ครอบสงขลาครอบคลุมกี่อำเภอในจังหวัดสงขลา?",
        options: ["2 อำเภอ", "4 อำเภอ", "6 อำเภอ", "ทั้งจังหวัดสงขลา"],
        correctAnswer: "4 อำเภอ",
      },
      {
        text: 'ข้อใดคือลักษณะการจัดวางไข่แดงที่เป็นเอกลักษณ์ของ "ไข่ครอบ"?',
        options: [
          "ใส่ไข่แดง 1 ใบต่อเปลือกไข่ 1 ใบ",
          "ใส่ไข่แดง 2 ใบประกบกันในเปลือกไข่ 1 ใบ",
          "ใส่ไข่แดง 3 ใบซ้อนกันในเปลือกไข่ 2 ใบ",
          "ผสมไข่แดงกับไข่ขาวแล้วเทกลับใส่เปลือก",
        ],
        correctAnswer: "ใส่ไข่แดง 2 ใบประกบกันในเปลือกไข่ 1 ใบ",
      },
      {
        text: 'เนื้อสัมผัสแบบใดของไข่ครอบที่มีลักษณะ "เนียนและไหลเยิ้มด้านใน"?',
        options: ["เนื้อดั้งเดิม", "เนื้อยางมะตูม", "เนื้อลาวา", "เนื้อแข็งพิเศษ"],
        correctAnswer: "เนื้อลาวา",
      },
      {
        text: 'ภูมิปัญญาดั้งเดิมในการทำไข่ครอบมีจุดเริ่มต้นมาจาก "อาชีพ" ใด?',
        options: ["เกษตรกรปลูกข้าว", "ชาวประมง", "พ่อค้าขายไข่เป็ด", "ช่างทำเครื่องปั้นดินเผา"],
        correctAnswer: "ชาวประมง",
      },
      {
        text: 'ในอดีต ชาวบ้านนำ "ไข่ขาว" ที่เหลือจากการทำไข่ครอบไปใช้ประโยชน์ในด้านใด?',
        options: [
          "ใช้ผสมปูนสร้างบ้าน",
          "ใช้หมักผมให้เงางาม",
          "ใช้ย้อมอุปกรณ์จับสัตว์น้ำ (ด้ายดิบ) เพื่อให้ทนทานและจมน้ำเร็ว",
          "ใช้ทำขนมหวานเพื่อส่งออก",
        ],
        correctAnswer: "ใช้ย้อมอุปกรณ์จับสัตว์น้ำ (ด้ายดิบ) เพื่อให้ทนทานและจมน้ำเร็ว",
      },
      {
        text: "ปัจจัยทางภูมิศาสตร์ข้อใดที่ส่งผลให้ไข่เป็ดในพื้นที่คาบสมุทรสทิงพระมีคุณภาพดี?",
        options: [
          "พื้นที่เป็นภูเขาสูงอากาศหนาวเย็น",
          "เป็นแหล่งน้ำจืดสนิทตลอดทั้งปี",
          'ระบบนิเวศ "ทะเลสาบสามน้ำ" ที่อุดมด้วยอาหารธรรมชาติของเป็ด',
          "พื้นที่เป็นดินเหนียวทำให้เป็ดวางไข่ได้ง่าย",
        ],
        correctAnswer: 'ระบบนิเวศ "ทะเลสาบสามน้ำ" ที่อุดมด้วยอาหารธรรมชาติของเป็ด',
      },
      {
        text: "รสชาติที่เป็นเอกลักษณ์ของไข่ครอบสงขลาคือลักษณะใด?",
        options: [
          "หวานนำและมีกลิ่นคาวแรง",
          "เค็มจัดและเนื้อสาก",
          "มันและเค็มเล็กน้อย กลมกล่อม ไม่มีกลิ่นคาว",
          "จืดและเนื้อเหลวเหมือนไข่สด",
        ],
        correctAnswer: "มันและเค็มเล็กน้อย กลมกล่อม ไม่มีกลิ่นคาว",
      },
      {
        text: 'วิธีการทำให้ไข่ครอบ "สุก" ในปัจจุบันเปลี่ยนจากวิธีใดมาเป็นวิธีใด?',
        options: ["จากการต้ม เป็นการย่าง", "จากการตากแดด เป็นการนึ่ง", "จากการทอด เป็นการอบ", "จากการนึ่ง เป็นการต้ม"],
        correctAnswer: "จากการตากแดด เป็นการนึ่ง",
      },
      {
        text: "ข้อใดคือลักษณะของไข่แดงที่ได้จากเป็ดที่เลี้ยงในพื้นที่คาบสมุทรสทิงพระ?",
        options: [
          "ไข่แดงสีซีดและฟองเล็ก",
          "ไข่แดงสีสด เปลือกแข็ง และมีความมันเฉพาะตัว",
          "ไข่แดงมีรสเปรี้ยวนิดๆ",
          "ไข่แดงจะมีน้ำเหลวมากกว่าปกติ",
        ],
        correctAnswer: "ไข่แดงสีสด เปลือกแข็ง และมีความมันเฉพาะตัว",
      },
    ],
  };

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createDefaultProfile() {
    return {
      fullName: "ผู้เรียน GI Songkhla Explorer",
      email: DEMO_EMAIL,
      avatarUrl: "",
    };
  }

  function resolveRouteSlug(slug) {
    return ROUTE_MIGRATIONS[slug] || slug;
  }

  function createDefaultRouteState(route) {
    return {
      slug: route.slug,
      learningStarted: false,
      gameOpened: false,
      gameCompleted: false,
      quizScore: null,
      quizTotal: window.SongkhlaData.quizPerRoute,
      quizPercent: 0,
      completedAt: null,
      gameCompletedAt: null,
    };
  }

  function normalizeRouteProgress(routeState) {
    const expectedQuizTotal = window.SongkhlaData.quizPerRoute;
    const next = {
      ...routeState,
      quizTotal: Number.isFinite(routeState?.quizTotal)
        ? routeState.quizTotal
        : expectedQuizTotal,
    };

    if (next.quizTotal !== expectedQuizTotal) {
      next.quizScore = null;
      next.quizTotal = expectedQuizTotal;
      next.quizPercent = 0;
      next.completedAt = null;
    }

    if (typeof next.quizScore !== "number") {
      next.quizScore = null;
      next.quizPercent = 0;
      next.completedAt = null;
    } else {
      next.quizScore = Math.max(0, Math.min(next.quizScore, next.quizTotal));
      next.quizPercent = Math.round((next.quizScore / next.quizTotal) * 100);
    }

    return next;
  }

  function createDefaultState() {
    const routeState = {};
    window.SongkhlaData.routes.forEach((route) => {
      routeState[route.slug] = createDefaultRouteState(route);
    });

    return {
      profile: createDefaultProfile(),
      routes: routeState,
      certificate: null,
      lastUpdatedAt: null,
    };
  }

  function totalPossibleScoreFor(stateLike) {
    return Object.values(stateLike.routes).reduce(
      (sum, item) => sum + (item.quizTotal || window.SongkhlaData.quizPerRoute),
      0
    );
  }

  function averagePercentFor(stateLike) {
    const totalPossible = totalPossibleScoreFor(stateLike);
    const totalScore = Object.values(stateLike.routes).reduce(
      (sum, item) => sum + (typeof item.quizScore === "number" ? item.quizScore : 0),
      0
    );
    return totalPossible ? Math.round((totalScore / totalPossible) * 100) : 0;
  }

  function canIssueCertificateFor(stateLike) {
    const routeStates = Object.values(stateLike.routes);
    const allQuizCompleted = routeStates.every((item) => item.quizScore !== null);
    const allGamesOpened = routeStates.every((item) => item.gameOpened);
    return (
      allQuizCompleted &&
      allGamesOpened &&
      averagePercentFor(stateLike) >= window.SongkhlaData.certificatePassPercent
    );
  }

  function ensureStateShape(candidate) {
    const next = createDefaultState();
    const source = candidate && typeof candidate === "object" ? candidate : {};

    if (source.profile) {
      next.profile = {
        ...next.profile,
        ...source.profile,
      };
    }

    if (source.routes && typeof source.routes === "object") {
      Object.keys(source.routes).forEach((slug) => {
        const resolvedSlug = resolveRouteSlug(slug);
        if (!next.routes[resolvedSlug]) {
          return;
        }

        next.routes[resolvedSlug] = normalizeRouteProgress({
          ...next.routes[resolvedSlug],
          ...source.routes[slug],
          slug: resolvedSlug,
        });
      });
    }

    if (source.certificate) {
      next.certificate = { ...source.certificate };
    }

    if (!canIssueCertificateFor(next)) {
      next.certificate = null;
    }

    next.lastUpdatedAt = source.lastUpdatedAt || null;
    return next;
  }

  function loadLocalState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return createDefaultState();
      }
      return ensureStateShape(JSON.parse(raw));
    } catch (error) {
      console.warn("Unable to parse local state.", error);
      return createDefaultState();
    }
  }

  function saveLocalState(nextState = state) {
    nextState.lastUpdatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }

  function resetState() {
    state = createDefaultState();
    saveLocalState(state);
    return deepClone(state);
  }

  function routeBySlug(slug) {
    const resolvedSlug = resolveRouteSlug(slug);
    return window.SongkhlaData.routes.find((route) => route.slug === resolvedSlug) || null;
  }

  function routeBySvgId(svgId) {
    return window.SongkhlaData.routes.find((route) => route.svgId === svgId) || null;
  }

  function generateCertificateCode() {
    const value = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, "0");
    return `SP-SK-${value}`;
  }

  function buildQuiz(route) {
    const questions = QUIZ_BANK[route?.slug] || [];
    return questions.map((question, index) => ({
      id: `${route.slug}-q${index + 1}`,
      order: index + 1,
      ...question,
    }));
  }

  let state = loadLocalState();

  async function syncRemoteState({ resetFirst = false } = {}) {
    if (!window.SupabaseService) {
      return;
    }

    if (resetFirst) {
      state = createDefaultState();
    }

    const remoteBundle = await window.SupabaseService.fetchBundle();
    if (!remoteBundle) {
      saveLocalState(state);
      return;
    }

    if (remoteBundle.profile) {
      state.profile = {
        ...state.profile,
        ...remoteBundle.profile,
      };
    }

    if (Array.isArray(remoteBundle.progress)) {
      remoteBundle.progress.forEach((entry) => {
        const resolvedSlug = resolveRouteSlug(entry?.gi_slug);
        if (!entry || !state.routes[resolvedSlug]) {
          return;
        }

        state.routes[resolvedSlug] = normalizeRouteProgress({
          ...state.routes[resolvedSlug],
          slug: resolvedSlug,
          learningStarted: !!entry.learning_started,
          gameOpened: !!entry.game_opened,
          gameCompleted: !!entry.game_completed,
          quizScore: entry.quiz_score ?? null,
          quizTotal: entry.quiz_total || window.SongkhlaData.quizPerRoute,
          quizPercent: entry.quiz_percent || 0,
          completedAt: entry.quiz_completed_at || null,
          gameCompletedAt: entry.game_completed_at || null,
        });
      });
    }

    if (remoteBundle.certificate) {
      state.certificate = remoteBundle.certificate;
    }

    if (!canIssueCertificateFor(state)) {
      state.certificate = null;
    }

    saveLocalState(state);
  }

  function getState() {
    return deepClone(state);
  }

  function getRouteProgress(slug) {
    const route = state.routes[resolveRouteSlug(slug)];
    return deepClone(route || createDefaultRouteState(routeBySlug(slug)));
  }

  function totalPossibleScore() {
    return totalPossibleScoreFor(state);
  }

  function getStats() {
    const routeStates = Object.values(state.routes);
    const totalScore = routeStates.reduce(
      (sum, item) => sum + (typeof item.quizScore === "number" ? item.quizScore : 0),
      0
    );
    const completedRoutes = routeStates.filter((item) => item.quizScore !== null).length;
    const gamesOpened = routeStates.filter((item) => item.gameOpened).length;
    const averagePercent = averagePercentFor(state);
    const passedRoutes = routeStates.filter(
      (item) => (item.quizPercent || 0) >= window.SongkhlaData.certificatePassPercent
    ).length;

    return {
      totalScore,
      totalPossible: totalPossibleScore(),
      completedRoutes,
      totalRoutes: window.SongkhlaData.routes.length,
      averagePercent,
      gamesOpened,
      passedRoutes,
      certificateReady: canIssueCertificate(),
    };
  }

  function canIssueCertificate() {
    return canIssueCertificateFor(state);
  }

  async function maybeIssueCertificate() {
    if (!canIssueCertificate()) {
      state.certificate = null;
      saveLocalState(state);
      return null;
    }

    if (state.certificate) {
      return deepClone(state.certificate);
    }

    const stats = getStats();
    state.certificate = {
      code: generateCertificateCode(),
      issuedAt: new Date().toISOString(),
      totalScore: stats.totalScore,
      totalPossible: stats.totalPossible,
      averagePercent: stats.averagePercent,
      fullName: state.profile.fullName || "ผู้เรียน GI Songkhla Explorer",
      email: state.profile.email || DEMO_EMAIL,
    };

    saveLocalState(state);

    if (window.SupabaseService) {
      await window.SupabaseService.saveCertificate(state.certificate);
    }

    return deepClone(state.certificate);
  }

  async function saveProfile(profile) {
    state.profile = {
      ...state.profile,
      ...profile,
    };

    saveLocalState(state);

    if (window.SupabaseService) {
      await window.SupabaseService.saveProfile(state.profile);
    }

    return deepClone(state.profile);
  }

  async function updateRouteProgress(slug, patch) {
    const resolvedSlug = resolveRouteSlug(slug);
    const current = state.routes[resolvedSlug];
    if (!current) {
      return null;
    }

    state.routes[resolvedSlug] = normalizeRouteProgress({
      ...current,
      ...patch,
      slug: resolvedSlug,
    });

    if (!canIssueCertificateFor(state)) {
      state.certificate = null;
    }

    saveLocalState(state);

    if (window.SupabaseService) {
      await window.SupabaseService.saveRouteProgress(state.routes[resolvedSlug]);
    }

    await maybeIssueCertificate();
    return deepClone(state.routes[resolvedSlug]);
  }

  async function markLearningStarted(slug) {
    return updateRouteProgress(slug, { learningStarted: true });
  }

  async function markGameOpened(slug) {
    return updateRouteProgress(slug, { gameOpened: true });
  }

  async function markGameCompleted(slug) {
    return markGameOpened(slug);
  }

  async function saveQuizResult(slug, score, total) {
    const quizTotal = total || window.SongkhlaData.quizPerRoute;
    const quizPercent = Math.round((score / quizTotal) * 100);
    return updateRouteProgress(slug, {
      quizScore: score,
      quizTotal,
      quizPercent,
      completedAt: new Date().toISOString(),
    });
  }

  async function logout() {
    if (window.SupabaseService) {
      await window.SupabaseService.logout();
    }

    resetState();
  }

  const ready = (async () => {
    await syncRemoteState();
    await maybeIssueCertificate();
  })();

  if (window.SupabaseService?.onAuthStateChange) {
    window.SupabaseService.onAuthStateChange(async (event) => {
      if (event === "SIGNED_OUT") {
        resetState();
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        await syncRemoteState({ resetFirst: true });
        await maybeIssueCertificate();
      }
    });
  }

  window.SongkhlaApp = {
    ready,
    getState,
    getProfile: () => deepClone(state.profile),
    resetState,
    reloadRemoteState: (options) => syncRemoteState(options),
    saveProfile,
    getStats,
    getRouteProgress,
    getRouteBySlug: routeBySlug,
    getRouteBySvgId: routeBySvgId,
    getQuizForRoute: (slug) => buildQuiz(routeBySlug(slug)),
    markLearningStarted,
    markGameOpened,
    markGameCompleted,
    saveQuizResult,
    maybeIssueCertificate,
    getCertificate: () => (state.certificate ? deepClone(state.certificate) : null),
    canIssueCertificate,
    logout,
  };
})();
