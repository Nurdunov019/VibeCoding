from auth import hash_password
from models import User, Complex, Document, LegalReport

SAMPLE_PDF = "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf"

DEMO_COMPLEXES = [
    {
        "name": 'ЖК "Хан-Тенири"',
        "slug": "han-teniri",
        "developer": "Хан-Тенгри (Чайнатаун Недвижимость)",
        "address": "ул. Токтоналиева 163",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "4 кв.",
        "completion_year": 2028,
        "price_per_sqm_usd": 3000,
        "price_per_sqm_kgs": 262350,
        "class_type": "premium",
        "floors": 25,
        "apartments_count": 420,
        "verification_score": 85,
        "verification_status": "verified",
        "image_url": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop",
        "description": "Премиальный жилой комплекс в центре Бишкека. Полный пакет разрешительных документов проверен.",
        "latitude": 42.8746,
        "longitude": 74.6123,
    },
    {
        "name": 'ЖК "VIVA"',
        "slug": "viva",
        "developer": "Prima Construction",
        "address": "Улица 7 апреля, 1/1а",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "2 кв.",
        "completion_year": 2028,
        "price_per_sqm_usd": 1400,
        "price_per_sqm_kgs": 122428,
        "class_type": "comfort",
        "floors": 18,
        "apartments_count": 310,
        "verification_score": 72,
        "verification_status": "partial",
        "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop",
        "description": "Современный жилой комплекс комфорт-класса. Часть документов требует актуализации.",
        "latitude": 42.8571,
        "longitude": 74.5898,
    },
    {
        "name": 'ЖК "АККУЛА"',
        "slug": "akkula",
        "developer": "CAPSTROY KG",
        "address": "ул. Матыева 21 (район Ипподром)",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "4 кв.",
        "completion_year": 2028,
        "price_per_sqm_usd": 1400,
        "price_per_sqm_kgs": 122364,
        "class_type": "business",
        "floors": 16,
        "apartments_count": 280,
        "verification_score": 45,
        "verification_status": "risk",
        "image_url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop",
        "description": "Бизнес-класс. Выявлены пробелы в разрешительной документации — рекомендуем юридическую проверку.",
        "latitude": 42.8356,
        "longitude": 74.6012,
    },
    {
        "name": "Green Side",
        "slug": "green-side",
        "developer": 'ОсОО "Исман"',
        "address": "ул. Ахунбаева 207",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "commissioned",
        "completion_quarter": "2 кв.",
        "completion_year": 2025,
        "price_per_sqm_usd": 1500,
        "price_per_sqm_kgs": 131165,
        "class_type": "comfort",
        "floors": 12,
        "apartments_count": 96,
        "verification_score": 95,
        "verification_status": "verified",
        "image_url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop",
        "description": "Дом сдан в эксплуатацию. Все документы проверены и актуальны.",
        "latitude": 42.8823,
        "longitude": 74.6345,
    },
    {
        "name": 'ЖК "Нур Ош"',
        "slug": "nur-osh",
        "developer": "Ош Строй",
        "address": "пр. Ленина 45",
        "city": "Ош",
        "region": "osh",
        "status": "building",
        "completion_quarter": "3 кв.",
        "completion_year": 2027,
        "price_per_sqm_usd": 900,
        "price_per_sqm_kgs": 78705,
        "class_type": "comfort",
        "floors": 12,
        "apartments_count": 180,
        "verification_score": 68,
        "verification_status": "partial",
        "image_url": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=500&fit=crop",
        "description": "Жаңы үй Ош шаарында. Документтер жарым-жартылай текшерилген.",
        "latitude": 40.5283,
        "longitude": 72.7985,
    },
]

DOCS_TEMPLATE = [
    ("land_title", "Право застройки земельного участка", "valid"),
    ("construction_permit", "Разрешение на строительство", "valid"),
    ("expertise", "Государственная экспертиза", "valid"),
    ("commissioning", "Разрешение на ввод в эксплуатацию", "missing"),
    ("ownership_scheme", "Схема оформления прав собственности", "valid"),
]


def seed_database(db):
    admin = db.query(User).filter(User.email == "admin@proverkakg.kg").first()
    if not admin:
        admin = User(
            email="admin@proverkakg.kg",
            password_hash=hash_password("admin123"),
            full_name="Администратор",
            is_admin=True,
        )
        db.add(admin)
        db.commit()

    if db.query(Complex).count() > 0:
        for data in DEMO_COMPLEXES:
            c = db.query(Complex).filter(Complex.slug == data["slug"]).first()
            if c:
                if c.latitude is None or c.longitude is None:
                    c.latitude = data.get("latitude")
                    c.longitude = data.get("longitude")
                if not c.region:
                    c.region = data.get("region", "bishkek")
                for doc in c.documents:
                    if doc.status == "valid" and not doc.file_url:
                        doc.file_url = SAMPLE_PDF
                for report in c.legal_reports:
                    if not report.file_path:
                        report.file_path = SAMPLE_PDF
        for c in db.query(Complex).filter(Complex.region.is_(None)).all():
            c.region = "bishkek"
        if not db.query(Complex).filter(Complex.slug == "nur-osh").first():
            data = next(d for d in DEMO_COMPLEXES if d["slug"] == "nur-osh")
            c = Complex(**data)
            db.add(c)
            db.flush()
            statuses = ["valid", "valid", "pending", "missing", "valid"]
            for j, (doc_type, title, _) in enumerate(DOCS_TEMPLATE):
                st = statuses[j]
                db.add(Document(
                    complex_id=c.id,
                    doc_type=doc_type,
                    title=title,
                    number=f"KG-{c.slug.upper()}-{j+1:03d}" if st == "valid" else None,
                    issued_by="Министерство строительства КР" if st == "valid" else None,
                    issued_date="2024-06-15" if st == "valid" else None,
                    status=st,
                    is_public=st == "valid",
                    file_url=SAMPLE_PDF if st == "valid" else None,
                ))
            db.add(LegalReport(
                complex_id=c.id,
                title=f"Юридическое заключение — {c.name}",
                summary="Экспертная оценка законности строительства и рисков для покупателя.",
                conclusion="документация частично подтверждена. Требуется дополнительная проверка перед покупкой.",
                risk_level="medium",
                prepared_at="15.01.2026",
                file_path=SAMPLE_PDF,
            ))
        db.commit()
        return

    for data in DEMO_COMPLEXES:
        c = Complex(**data)
        db.add(c)
        db.flush()

        statuses = ["valid", "valid", "valid", "missing", "valid"]
        if data["verification_status"] == "risk":
            statuses = ["valid", "missing", "expired", "missing", "pending"]
        elif data["verification_status"] == "partial":
            statuses = ["valid", "valid", "pending", "missing", "valid"]
        elif data["status"] == "commissioned":
            statuses = ["valid", "valid", "valid", "valid", "valid"]

        for j, (doc_type, title, _) in enumerate(DOCS_TEMPLATE):
            st = statuses[j]
            db.add(Document(
                complex_id=c.id,
                doc_type=doc_type,
                title=title,
                number=f"KG-{c.slug.upper()}-{j+1:03d}" if st == "valid" else None,
                issued_by="Министерство строительства КР" if st == "valid" else None,
                issued_date="2024-06-15" if st == "valid" else None,
                status=st,
                is_public=st == "valid",
                file_url=SAMPLE_PDF if st == "valid" else None,
            ))

        db.add(LegalReport(
            complex_id=c.id,
            title=f"Юридическое заключение — {c.name}",
            summary="Экспертная оценка законности строительства и рисков для покупателя.",
            conclusion=(
                f"По результатам проверки объекта «{c.name}»: "
                + (
                    "строительство ведётся на законных основаниях. Критических рисков не выявлено."
                    if data["verification_status"] == "verified"
                    else "выявлены существенные пробелы в документации. Рекомендуется отложить сделку до устранения замечаний."
                    if data["verification_status"] == "risk"
                    else "документация частично подтверждена. Требуется дополнительная проверка перед покупкой."
                )
            ),
            risk_level="low" if data["verification_score"] >= 80 else "high" if data["verification_score"] < 50 else "medium",
            prepared_at="15.01.2026",
            file_path=SAMPLE_PDF,
        ))

    db.commit()
