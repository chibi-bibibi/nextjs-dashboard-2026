INSERT INTO book_tools.main_categories(category_no, name, target) VALUES
('0', '総記', 'books'),
('1', '哲学', 'books'),
('2', '歴史', 'books'),
('3', '社会科学', 'books'),
('4', '自然科学', 'books'),
('5', '技術・工学・工業', 'books'),
('6', '産業', 'books'),
('7', '芸術・美術', 'books'),
('8', '言語', 'books'),
('9', '文学', 'books');


INSERT INTO book_tools.sub_categories (main_category_id, category_no, name) VALUES
((SELECT id FROM book_tools.main_categories WHERE category_no = '0'), '000', '総記'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '0'), '010', '図書館・図書館学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '0'), '020', '図書・書誌学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '0'), '030', '百科事典'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '0'), '040', '一般論文集・一般講演集'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '0'), '050', '逐次刊行物・年鑑'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '0'), '060', '学会・団体・研究調査機関'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '0'), '070', 'ジャーナリズム・新聞'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '0'), '080', '叢書・全集・選集'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '0'), '090', '貴重書・郷土資料・その他の特別コレクション');

INSERT INTO book_tools.sub_categories (main_category_id, category_no, name) VALUES
((SELECT id FROM book_tools.main_categories WHERE category_no = '1'), '100', '哲学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '1'), '110', '哲学各論'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '1'), '120', '東洋思想'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '1'), '130', '西洋哲学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '1'), '140', '心理学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '1'), '150', '倫理学・道徳'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '1'), '160', '宗教'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '1'), '170', '神道'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '1'), '180', '仏教'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '1'), '190', 'キリスト教');

INSERT INTO book_tools.sub_categories (main_category_id, category_no, name) VALUES
((SELECT id FROM book_tools.main_categories WHERE category_no = '2'), '200', '歴史'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '2'), '210', '日本史'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '2'), '220', 'アジア史・東洋史'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '2'), '230', 'ヨーロッパ史・西洋史'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '2'), '240', 'アフリカ史'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '2'), '250', '北アメリカ史'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '2'), '260', '南アメリカ史'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '2'), '270', 'オセアニア史・両極地方史'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '2'), '280', '伝記'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '2'), '290', '地理・地誌・紀行');

INSERT INTO book_tools.sub_categories (main_category_id, category_no, name) VALUES
((SELECT id FROM book_tools.main_categories WHERE category_no = '3'), '300', '社会科学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '3'), '310', '政治'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '3'), '320', '法律'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '3'), '330', '経済'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '3'), '340', '財政'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '3'), '350', '統計'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '3'), '360', '社会'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '3'), '370', '教育'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '3'), '380', '風俗習慣・民俗学・民族学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '3'), '390', '国防・軍事');

INSERT INTO book_tools.sub_categories (main_category_id, category_no, name) VALUES
((SELECT id FROM book_tools.main_categories WHERE category_no = '4'), '400', '自然科学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '4'), '410', '数学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '4'), '420', '物理学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '4'), '430', '化学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '4'), '440', '天文学・宇宙科学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '4'), '450', '地球科学・地学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '4'), '460', '生物科学・一般生物学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '4'), '470', '植物学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '4'), '480', '動物学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '4'), '490', '医学');

INSERT INTO book_tools.sub_categories (main_category_id, category_no, name) VALUES
((SELECT id FROM book_tools.main_categories WHERE category_no = '5'), '500', '技術・工学・工業'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '5'), '510', '建設工学・土木工学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '5'), '520', '建築学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '5'), '530', '機械工学・原子力工学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '5'), '540', '電気工学・電子工学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '5'), '550', '海洋工学・船舶工学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '5'), '560', '金属工学・鉱山工学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '5'), '570', '化学工業'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '5'), '580', '製造工業'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '5'), '590', '家政学・生活科学');

INSERT INTO book_tools.sub_categories (main_category_id, category_no, name) VALUES
((SELECT id FROM book_tools.main_categories WHERE category_no = '6'), '600', '産業'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '6'), '610', '農業'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '6'), '620', '園芸'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '6'), '630', '蚕糸業'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '6'), '640', '畜産業'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '6'), '650', '林業'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '6'), '660', '水産業'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '6'), '670', '商業'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '6'), '680', '運輸・交通'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '6'), '690', '通信事業');

INSERT INTO book_tools.sub_categories (main_category_id, category_no, name) VALUES
((SELECT id FROM book_tools.main_categories WHERE category_no = '7'), '700', '芸術・美術'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '7'), '710', '彫刻'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '7'), '720', '絵画'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '7'), '730', '版画'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '7'), '740', '写真'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '7'), '750', '工芸'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '7'), '760', '音楽'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '7'), '770', '演劇'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '7'), '780', 'スポーツ・体育'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '7'), '790', '諸芸・娯楽');

INSERT INTO book_tools.sub_categories (main_category_id, category_no, name) VALUES
((SELECT id FROM book_tools.main_categories WHERE category_no = '8'), '800', '言語'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '8'), '810', '日本語'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '8'), '820', '中国語'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '8'), '830', '英語'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '8'), '840', 'ドイツ語'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '8'), '850', 'フランス語'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '8'), '860', 'スペイン語'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '8'), '870', 'イタリア語'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '8'), '880', 'ロシア語'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '8'), '890', 'その他の諸言語');

INSERT INTO book_tools.sub_categories (main_category_id, category_no, name) VALUES
((SELECT id FROM book_tools.main_categories WHERE category_no = '9'), '900', '文学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '9'), '910', '日本文学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '9'), '920', '中国文学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '9'), '930', '英米文学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '9'), '940', 'ドイツ文学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '9'), '950', 'フランス文学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '9'), '960', 'スペイン文学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '9'), '970', 'イタリア文学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '9'), '980', 'ロシア・ソヴィエト文学'),
((SELECT id FROM book_tools.main_categories WHERE category_no = '9'), '990', 'その他の諸文学');
