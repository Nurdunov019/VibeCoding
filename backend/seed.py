import os
from auth import hash_password
from models import User, Complex, Document, LegalReport, Review

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@proverkakg.kg")
ADMIN_PASSWORD = "112233"

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

FEATURED_COMPLEXES = [
    {
        "name": 'ЖК "Салкын"',
        "slug": "salkyn",
        "developer": "ОсОО «Роял Констракшн»",
        "address": "ул. Чокана Валиханова",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "2 кв.",
        "completion_year": 2028,
        "price_per_sqm_usd": 1300,
        "price_per_sqm_kgs": 113750,
        "class_type": "business",
        "floors": 18,
        "buildings_count": 4,
        "entrances_count": 6,
        "apartments_count": None,
        "verification_score": 55,
        "verification_status": "partial",
        "initial_payment_percent": 30,
        "barter_extra_usd_sqm": 50,
        "barter_min_payment_percent": 40,
        "installment_months": 28,
        "has_red_book": True,
        "image_url": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
        "catalog_pdf_url": "/catalogs/salkyn.pdf",
        "description": (
            "Комплекс бизнес-класса. 18 этажей, 4 блока, 6 подъездов. "
            "Расположен по адресу ул. Чокана Валиханова (Октябрьский район, г. Бишкек). "
            "Участок на красной книге — рекомендуется юридическая проверка перед покупкой."
        ),
        "features": (
            "360° шумоизоляция между этажами и между квартирами\n"
            "Двухуровневая подземная парковка\n"
            "Гостевая парковка"
        ),
        "latitude": 42.85791,
        "longitude": 74.674336,
    },
    {
        "name": 'ЖК "BROWN"',
        "slug": "borsan-brown",
        "developer": "Borsan Construction",
        "address": "Анкара — Ауэзова (район Тунгуч)",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "1 кв.",
        "completion_year": 2028,
        "price_per_sqm_usd": 1300,
        "price_per_sqm_kgs": 113750,
        "class_type": "business",
        "floors": 12,
        "buildings_count": 1,
        "entrances_count": 4,
        "apartments_count": 220,
        "verification_score": 52,
        "verification_status": "partial",
        "initial_payment_percent": 30,
        "installment_months": 30,
        "has_red_book": True,
        "image_url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
        "description": (
            "Жилой комплекс BROWN от застройщика Borsan. "
            "Индивидуальное отопление (газ), горячая вода — бойлер Ariston. "
            "Участок на красной книге. Подробнее: borsan.kg"
        ),
        "features": (
            "Индивидуальное отопление (газ)\n"
            "Горячая вода — бойлер Ariston\n"
            "Современная архитектура\n"
            "Развитая инфраструктура района Тунгуч"
        ),
        "latitude": 42.8367,
        "longitude": 74.6234,
    },
]

DOCS_TEMPLATE = [
    ("land_title", "Право застройки земельного участка", "valid"),
    ("construction_permit", "Разрешение на строительство", "valid"),
    ("expertise", "Государственная экспертиза", "valid"),
    ("commissioning", "Разрешение на ввод в эксплуатацию", "missing"),
    ("ownership_scheme", "Схема оформления прав собственности", "valid"),
]

SALKYN_DOCUMENTS = [
    {
        "doc_type": "land_title",
        "title": "Право застройки земельного участка",
        "status": "pending",
        "number": None,
        "issued_by": "Государственный кадастр КР",
        "issued_date": None,
        "notes": (
            "Земельный участок: ул. Чокана Валиханова, Октябрьский район, г. Бишкек. "
            "📕 Участок на красной книге — перед покупкой рекомендуется юридическая проверка "
            "права застройки и обременений."
        ),
        "file_url": None,
        "is_public": True,
    },
    {
        "doc_type": "construction_permit",
        "title": "Разрешение на строительство",
        "status": "valid",
        "number": "крц-2 № 09635",
        "issued_by": "ОсОО «Роял Констракшн»",
        "issued_date": None,
        "notes": (
            "Жилой комплекс бизнес-класса «Салкын»: 4 блока, 18 этажей, 6 подъездов. "
            "Застройщик зарегистрирован в реестре: крц-2 № 09635. "
            "Информация из брошюры носит ознакомительный характер; детали — в офисе продаж (royal.kg)."
        ),
        "file_url": None,
        "is_public": True,
    },
    {
        "doc_type": "expertise",
        "title": "Государственная экспертиза проекта",
        "status": "pending",
        "number": None,
        "issued_by": None,
        "issued_date": None,
        "notes": (
            "Проектная документация многоэтажного комплекса (бизнес-класс) "
            "проходит государственную экспертизу. Статус уточняется у застройщика."
        ),
        "file_url": None,
        "is_public": True,
    },
    {
        "doc_type": "commissioning",
        "title": "Акт ввода в эксплуатацию",
        "status": "missing",
        "number": None,
        "issued_by": None,
        "issued_date": None,
        "notes": (
            "Объект в стадии строительства. Планируемый срок сдачи — 2 квартал 2028 года. "
            "Разрешение на ввод в эксплуатацию оформляется после завершения строительства."
        ),
        "file_url": None,
        "is_public": True,
    },
    {
        "doc_type": "ownership_scheme",
        "title": "Схема оформления прав собственности",
        "status": "valid",
        "number": None,
        "issued_by": "ОсОО «Роял Констракшн»",
        "issued_date": None,
        "notes": (
            "Оформление права собственности на квартиру — долевая собственность "
            "с регистрацией в ГРС. Условия договора, рассрочка до 28 месяцев, "
            "первоначальный взнос 30%. Подробности — в офисе продаж."
        ),
        "file_url": None,
        "is_public": True,
    },
]

SALKYN_LEGAL = {
    "title": "Юридическое заключение — ЖК «Салкын»",
    "summary": "Предварительная оценка документации на основании данных застройщика и брошюры.",
    "conclusion": (
        "Объект бизнес-класса, застройщик ОсОО «Роял Констракшн» (крц-2 № 09635). "
        "Участок на красной книге. Рекомендуется юридическая проверка перед покупкой."
    ),
    "risk_level": "medium",
    "prepared_at": "2026",
    "file_path": None,
}


DEMO_REVIEWS = [
    ("Айгүл Т.", 5, "Жашоо ыңгайлуу, кореилер жакшы. Баардык документтер туура, менеджмент тез жооп берет."),
    ("Нурбек К.", 4, "Жакшы ЖК, бирок парковка аз. Кошуна жакшы, инфраструктура жакында."),
]


def _add_complex_bundle(db, data, statuses):
    c = Complex(**data)
    db.add(c)
    db.flush()
    for j, (doc_type, title, _) in enumerate(DOCS_TEMPLATE):
        st = statuses[j]
        db.add(Document(
            complex_id=c.id,
            doc_type=doc_type,
            title=title,
            number=f"KG-{c.slug.upper().replace('-', '')}-{j+1:03d}" if st == "valid" else None,
            issued_by="Министерство строительства КР" if st == "valid" else None,
            issued_date="2024-06-15" if st == "valid" else None,
            status=st,
            is_public=st == "valid",
            file_url=SAMPLE_PDF if st == "valid" else None,
            notes="Участок на красной книге" if doc_type == "land_title" and data.get("has_red_book") else None,
        ))
    db.add(LegalReport(
        complex_id=c.id,
        title=f"Юридическое заключение — {c.name}",
        summary="Экспертная оценка законности строительства и рисков для покупателя.",
        conclusion=(
            f"По объекту «{c.name}»: участок на красной книге. "
            "Документация частично подтверждена. Рекомендуется юридическая проверка перед покупкой."
        ),
        risk_level="medium",
        prepared_at="15.01.2026",
        file_path=SAMPLE_PDF,
    ))
    return c


def seed_featured_complexes(db):
    for data in FEATURED_COMPLEXES:
        existing = db.query(Complex).filter(Complex.slug == data["slug"]).first()
        if existing:
            for key, value in data.items():
                setattr(existing, key, value)
            continue
        statuses = ["valid", "valid", "pending", "missing", "valid"]
        if data.get("has_red_book"):
            statuses = ["pending", "valid", "pending", "missing", "valid"]
        _add_complex_bundle(db, data, statuses)


def seed_salkyn_documents(db):
    from services.verification import sync_complex_verification

    c = db.query(Complex).filter(Complex.slug == "salkyn").first()
    if not c:
        return
    for spec in SALKYN_DOCUMENTS:
        matches = db.query(Document).filter(
            Document.complex_id == c.id,
            Document.doc_type == spec["doc_type"],
        ).order_by(Document.id).all()
        doc = matches[0] if matches else None
        for extra in matches[1:]:
            db.delete(extra)
        if doc:
            for key, value in spec.items():
                setattr(doc, key, value)
        else:
            db.add(Document(complex_id=c.id, **spec))
    report = db.query(LegalReport).filter(LegalReport.complex_id == c.id).first()
    if report:
        for key, value in SALKYN_LEGAL.items():
            setattr(report, key, value)
    else:
        db.add(LegalReport(complex_id=c.id, **SALKYN_LEGAL))
    sync_complex_verification(c.id, db)


def seed_reviews(db):
    green = db.query(Complex).filter(Complex.slug == "green-side").first()
    if not green or green.status != "commissioned":
        return
    if db.query(Review).filter(Review.complex_id == green.id).count() > 0:
        return

    for i, (name, rating, text) in enumerate(DEMO_REVIEWS):
        email = f"resident{i + 1}@demo.kg"
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                email=email,
                password_hash=hash_password("demo123"),
                full_name=name,
                is_admin=False,
            )
            db.add(user)
            db.flush()
        db.add(Review(complex_id=green.id, user_id=user.id, rating=rating, text=text))


def seed_database(db):
    admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
    if not admin:
        admin = User(
            email=ADMIN_EMAIL,
            password_hash=hash_password(ADMIN_PASSWORD),
            full_name="Администратор",
            is_admin=True,
        )
        db.add(admin)
    else:
        admin.password_hash = hash_password(ADMIN_PASSWORD)
        admin.is_admin = True
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
        seed_reviews(db)
        seed_featured_complexes(db)
        seed_salkyn_documents(db)
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

    seed_reviews(db)
    seed_featured_complexes(db)
    seed_salkyn_documents(db)
    db.commit()
