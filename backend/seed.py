import os
from auth import hash_password
from models import User, Complex, Document, LegalReport

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@proverkakg.kg")
ADMIN_PASSWORD = "112233"

SAMPLE_PDF = "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf"

KEEP_SLUGS = frozenset({"salkyn", "borsan-brown"})

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
        "image_url": "/images/salkyn.png",
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
        "developer": "ОсОО «Borsan Construction»",
        "address": "ул. Анкара, 22 (пересечение с ул. Ауэзова)",
        "city": "Бишкек",
        "region": "bishkek",
        "status": "building",
        "completion_quarter": "2 кв.",
        "completion_year": 2028,
        "price_per_sqm_usd": 1350,
        "price_per_sqm_kgs": 118125,
        "class_type": "premium",
        "floors": 18,
        "buildings_count": 4,
        "entrances_count": 4,
        "apartments_count": None,
        "verification_score": 53,
        "verification_status": "partial",
        "initial_payment_percent": 30,
        "installment_months": 30,
        "has_red_book": True,
        "image_url": "/images/brown.png",
        "description": (
            "Первый жилой комплекс премиум-класса в Тунгуче. 18 этажей, 4 блока, участок 1,025 га. "
            "Расположен на пересечении ул. Ауэзова и ул. Анкара (Октябрьский район, г. Бишкек). "
            "Застройщик — ОсОО «Борсан Констракшн». Подробнее: borsan.kg/brown"
        ),
        "features": (
            "Панорамные алюминиевые окна\n"
            "Высота потолков 3 м\n"
            "Шумо- и теплоизоляция\n"
            "Подземный и гостевой паркинг\n"
            "Терраса на 19 этаже\n"
            "Кофейни, рестораны и супермаркеты на 1 этаже\n"
            "Детские и спортивные площадки"
        ),
        "latitude": 42.85574,
        "longitude": 74.689741,
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
        "title": "Госакт о праве частной собственности на земельный участок",
        "status": "valid",
        "number": "Ч№1379474",
        "issued_by": "ГУ «Кадастр»",
        "issued_date": "06.10.2025",
        "notes": (
            "Земельный участок мерою 0,95 га: г. Бишкек, Октябрьский р-н, ул. Чокана Валиханова, д. 7. "
            "Идентификационный код: 1-04-15-0037-0061. "
            "Согласно выписке из ЕГРПНИ ГУ «Кадастр» от 12.09.2025 г. участок не заложен и в аресте не состоит. "
            "Целевое назначение «18-этажный жилой комплекс с объектами СКБ и двухуровневым подземным автопаркингом» "
            "соответствует нормам законодательства КР и цели строительства."
        ),
        "file_url": None,
        "is_public": True,
    },
    {
        "doc_type": "construction_permit",
        "title": "Архитектурно-градостроительное заключение (АГЗ)",
        "status": "valid",
        "number": "№16808",
        "issued_by": "МП «Бишкекглавархитектура»",
        "issued_date": "28.06.2024",
        "notes": (
            "Объект: «18-этажный жилой комплекс с объектами СКБ и двухуровневым подземным автопаркингом "
            "на собственной территории» (ЖК «Салкын»). Сейсмоустойчивость — 8 баллов. "
            "Инженерно-технические условия (ИТУ) МП «Бишкекглавархитектура» на момент проверки не предоставлены — "
            "застройщику необходимо получить."
        ),
        "file_url": None,
        "is_public": True,
    },
    {
        "doc_type": "expertise",
        "title": "Заключение государственной экспертизы проектно-технических решений",
        "status": "pending",
        "number": "№00-1-1-741",
        "issued_by": "Государственная экспертиза",
        "issued_date": "27.12.2024",
        "notes": (
            "Положительное заключение выдано только на 1 этап — разделы проекта: архитектурные и конструктивные решения. "
            "Заключение государственной экспертизы по инженерным коммуникациям (2 этап) отсутствует. "
            "Застройщику необходимо предоставить соответствующие разделы проектной документации "
            "согласно ПКМКР №114 от 06.08.2021 г."
        ),
        "file_url": None,
        "is_public": True,
    },
    {
        "doc_type": "commissioning",
        "title": "Разрешение на ввод в эксплуатацию",
        "status": "missing",
        "number": None,
        "issued_by": None,
        "issued_date": None,
        "notes": (
            "Объект находится в стадии строительства (4 блока, 18 этажей, 6 подъездов). "
            "Планируемый срок сдачи — 2 квартал 2028 года. "
            "Акт ввода в эксплуатацию и разрешение на ввод оформляются после завершения строительства."
        ),
        "file_url": None,
        "is_public": True,
    },
    {
        "doc_type": "ownership_scheme",
        "title": "Схема оформления прав собственности на квартиру",
        "status": "valid",
        "number": None,
        "issued_by": "ОсОО «Роял Констракшн»",
        "issued_date": None,
        "notes": (
            "Оформление права собственности — долевая собственность на помещение с регистрацией в ГРС. "
            "Условия приобретения: цена $1300/м², первоначальный взнос 30%, рассрочка до 28 месяцев, "
            "бартер +$50/м² при минимальном взносе 40%. Подробности договора — в офисе продаж застройщика."
        ),
        "file_url": None,
        "is_public": True,
    },
]

SALKYN_LEGAL = {
    "title": "Правовое заключение — ЖК «Салкын»",
    "summary": (
        "Документ актуален по состоянию на 10 сентября 2025 года. "
        "Содержит юридическую информацию о строящемся объекте недвижимости и правовых рисках."
    ),
    "conclusion": (
        "Цель экспертизы: выявление обстоятельств, которые могут привести к ограничению "
        "или утрате права собственности на квартиру.\n\n"
        "ОБЪЕКТ\n"
        "Застройщик и ген. подрядчик: ОсОО «Роял Констракшн»\n"
        "ЖК «Салкын», г. Бишкек, Октябрьский р-н, ул. Чокана Валиханова, д. 7\n"
        "«18-этажный жилой комплекс с объектами СКБ и двухуровневым подземным автопаркингом»\n"
        "ИКЗУ: 1-04-15-0037-0061\n\n"
        "ЗЕМЕЛЬНЫЙ УЧАСТОК\n"
        "Госакт о праве частной собственности Ч№1379474 от 06.10.2025 г. (0,95 га). "
        "Выписка ЕГРПНИ ГУ «Кадастр» от 12.09.2025 г.: обременений и ареста нет. "
        "Целевое назначение соответствует цели строительства.\n\n"
        "АРХИТЕКТУРНО-ГРАДОСТРОИТЕЛЬНОЕ ЗАКЛЮЧЕНИЕ\n"
        "АГЗ №16808 от 28.06.2024 г. Сейсмоустойчивость — 8 баллов.\n\n"
        "ГОСУДАРСТВЕННАЯ ЭКСПЕРТИЗА\n"
        "Положительное заключение, реестр №00-1-1-741 от 27.12.2024 г. — только 1 этап "
        "(архитектурные и конструктивные решения). Заключение по инженерным коммуникациям "
        "(2 этап) отсутствует.\n\n"
        "ИНЖЕНЕРНО-ТЕХНИЧЕСКИЕ УСЛОВИЯ\n"
        "ИТУ МП «Бишкекглавархитектура» не предоставлены.\n\n"
        "ЗАСТРОЙЩИК\n"
        "ОсОО «Роял Констракшн», рег. №167901-3301-ООО, ИИН 02507201710106. "
        "Директор: Акжигитов Мирлан Толонович. "
        "Налоги за 2024–2025 гг. оплачивались (budget.okmot.kg).\n\n"
        "РИСКИ И РЕКОМЕНДАЦИИ\n"
        "• Застройщику необходимо получить инженерно-технические условия\n"
        "• Застройщику необходимо получить заключение госэкспертизы II этапа (инженерная часть)\n"
        "• Перед сделкой рекомендуется уточнить статус разрешительной документации\n\n"
        "Заключение составлено по данным на 10.09.2025 г.\n"
        "Исполнитель: юрист ОСК, Эсенбекова И."
    ),
    "risk_level": "medium",
    "prepared_at": "10.09.2025",
    "file_path": "/documents/salkyn-legal.docx",
}

BROWN_DOCUMENTS = [
    {
        "doc_type": "land_title",
        "title": "Госакт о праве частной собственности на земельный участок",
        "status": "valid",
        "number": "Ч№1318135",
        "issued_by": "ГУ «Кадастр»",
        "issued_date": "27.04.2024",
        "notes": (
            "Земельный участок мерою 1,025 га: г. Бишкек, Октябрьский р-н, ул. Анкара, д. 22. "
            "ИКЗУ: 1-04-15-0037-0112. Собственник — ОсОО «Конкорд Инвест». "
            "Договор с застройщиком нотариально заверен и зарегистрирован в ЕГР. "
            "Выписка ЕГРПНИ: участок не заложен и в аресте не состоит. "
            "Целевое назначение соответствует цели строительства."
        ),
        "file_url": None,
        "is_public": True,
    },
    {
        "doc_type": "construction_permit",
        "title": "Градостроительное заключение (ГЗ)",
        "status": "valid",
        "number": "№МК-03-14/12333ЕО",
        "issued_by": "МП «Бишкекглавархитектура»",
        "issued_date": "25.07.2024",
        "notes": (
            "Объект: «18-ти этажные жилые дома с офисами, объектами торгово-сервисного назначения "
            "и подземным автопаркингом на собственной территории» (ЖК «Brown»). "
            "Сейсмоустойчивость — 8 баллов. Заключение УМЧС №69 от 28.02.2025 г."
        ),
        "file_url": None,
        "is_public": True,
    },
    {
        "doc_type": "expertise",
        "title": "Заключение государственной экспертизы проектно-технических решений",
        "status": "pending",
        "number": "№00-1-1-0017-25",
        "issued_by": "Государственная экспертиза",
        "issued_date": "17.03.2025",
        "notes": (
            "Положительное заключение выдано только на 1 этап — архитектурные и конструктивные решения. "
            "Заключение по инженерным коммуникациям (2 этап) отсутствует. "
            "Застройщику необходимо предоставить разделы проектной документации 2-го этапа."
        ),
        "file_url": None,
        "is_public": True,
    },
    {
        "doc_type": "commissioning",
        "title": "Разрешение на ввод в эксплуатацию",
        "status": "missing",
        "number": None,
        "issued_by": None,
        "issued_date": None,
        "notes": (
            "Объект находится в стадии строительства (4 блока, 18 этажей). "
            "Планируемый срок сдачи — 2 квартал 2028 года. "
            "Акт ввода в эксплуатацию оформляется после завершения строительства."
        ),
        "file_url": None,
        "is_public": True,
    },
    {
        "doc_type": "ownership_scheme",
        "title": "Схема оформления прав собственности на квартиру",
        "status": "valid",
        "number": None,
        "issued_by": "ОсОО «Борсан Констракшн»",
        "issued_date": None,
        "notes": (
            "Оформление через стандартный типовой договор долевого участия (ДДУ) "
            "с регистрацией права собственности в ГРС. "
            "Условия: цена от $1350/м², первоначальный взнос от 30%, "
            "беспроцентная рассрочка, бартер."
        ),
        "file_url": None,
        "is_public": True,
    },
]

BROWN_LEGAL = {
    "title": "Правовое заключение — ЖК «Brown»",
    "summary": (
        "Документ актуален по состоянию на 22 апреля 2025 года. "
        "Содержит юридическую информацию о строящемся объекте недвижимости и правовых рисках. "
        "Исполнитель: ОСК (osk.kg), юрист Эсенбеков И."
    ),
    "conclusion": (
        "Цель экспертизы: выявление обстоятельств, которые могут привести к ограничению "
        "или утрате права собственности на квартиру.\n\n"
        "ОБЪЕКТ\n"
        "Застройщик и ген. подрядчик: ОсОО «Борсан Констракшн»\n"
        "ЖК «Brown», г. Бишкек, Октябрьский р-н, ул. Анкара, д. 22\n"
        "«18-ти этажные жилые дома с офисами, объектами торгово-сервисного назначения "
        "и подземным автопаркингом на собственной территории по ул. Ауэзова, 22»\n"
        "ИКЗУ: 1-04-15-0037-0112 · участок 1,025 га\n\n"
        "ЗЕМЕЛЬНЫЙ УЧАСТОК\n"
        "Госакт Ч№1318135 от 27.04.2024 г. Собственник — ОсОО «Конкорд Инвест». "
        "Договор с застройщиком нотариально заверен и зарегистрирован. "
        "Выписка ЕГРПНИ: обременений и ареста нет. Целевое назначение соответствует цели строительства.\n\n"
        "ГРАДОСТРОИТЕЛЬНОЕ ЗАКЛЮЧЕНИЕ\n"
        "ГЗ №МК-03-14/12333ЕО от 25.07.2024 г. Сейсмоустойчивость — 8 баллов.\n\n"
        "ИНЖЕНЕРНО-ТЕХНИЧЕСКИЕ УСЛОВИЯ\n"
        "Водоснабжение — ТУ Бишкекводоканал 04№1062 от 17.07.2024 г.\n"
        "Энергоснабжение — ТУ НЭСК №39ТУ/167 от 27.01.2025 г.\n"
        "Газоснабжение — ТУ Газпром Кыргызстан №10-02-01/1106 от 10.11.2025 г.\n\n"
        "ГОСУДАРСТВЕННАЯ ЭКСПЕРТИЗА\n"
        "Положительное заключение №00-1-1-0017-25 от 17.03.2025 г. — только 1 этап "
        "(архитектурные и конструктивные решения). Заключение по инженерным коммуникациям "
        "(2 этап) отсутствует.\n\n"
        "ЗАСТРОЙЩИК\n"
        "ОсОО «Борсан Констракшн», рег. №127112-3301-ООО, ИИН 01501201310158. "
        "Директор: Ажиев Нурлан Болотович. Лицензия КРЦ-2 №07007 от 27.07.2016 г. "
        "Налоги за 2022–2024 гг. оплачивались (budget.okmot.kg).\n\n"
        "РИСКИ И РЕКОМЕНДАЦИИ\n"
        "• Застройщику необходимо получить технические условия в едином документе ИТУ\n"
        "• Застройщику необходимо получить заключение госэкспертизы II этапа (инженерная часть)\n"
        "• Перед сделкой рекомендуется уточнить статус разрешительной документации\n\n"
        "Заключение составлено по данным на 24.04.2025 г.\n"
        "Исполнитель: юрист ОСК, Эсенбеков И."
    ),
    "risk_level": "medium",
    "prepared_at": "22.04.2025",
    "file_path": "/documents/brown-legal.docx",
}


def purge_orphan_complexes(db):
    for c in db.query(Complex).filter(Complex.slug.notin_(KEEP_SLUGS)).all():
        db.delete(c)


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


def seed_brown_documents(db):
    from services.verification import sync_complex_verification

    c = db.query(Complex).filter(Complex.slug == "borsan-brown").first()
    if not c:
        return
    for spec in BROWN_DOCUMENTS:
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
        for key, value in BROWN_LEGAL.items():
            setattr(report, key, value)
    else:
        db.add(LegalReport(complex_id=c.id, **BROWN_LEGAL))
    sync_complex_verification(c.id, db)


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

    purge_orphan_complexes(db)
    seed_featured_complexes(db)
    seed_salkyn_documents(db)
    seed_brown_documents(db)
    db.commit()
